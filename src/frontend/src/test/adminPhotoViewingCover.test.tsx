import { makeJob } from "@/test/fixtures";
import {
  installCoreInfrastructureMocks,
  renderWithProviders,
  setActor,
} from "@/test/harness";
import { screen, waitFor, within } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

installCoreInfrastructureMocks();

vi.mock("@tanstack/react-router", () => ({
  Link: ({
    to,
    children,
    ...props
  }: {
    to: string;
    children: React.ReactNode;
  }) => (
    <a href={to} {...props}>
      {children}
    </a>
  ),
}));

/**
 * The accepted fix turns a stored photo hash into a displayable URL through
 * `StorageClient.getDirectURL` (the previous code produced a value an `<img>`
 * could not load). This file pins the observable result of that fix:
 *
 *  - every attached photo renders as a real `<img>` whose `src` is the URL the
 *    storage client resolved, so a mobile browser has something to display;
 *  - the image is wrapped in a link to that same URL opening in a new tab, so
 *    tapping the thumbnail opens the full-size photo;
 *  - a resolution failure shows the "Photo unavailable" fallback rather than a
 *    broken image, and does not take down the rest of the request card.
 *
 * `StorageClient` and the `HttpAgent` it needs are mocked locally: no network,
 * no real object storage, no replica.
 */
const getDirectURL = vi.fn(
  async (hash: string) => `https://gateway.test/v1/blob/?blob_hash=${hash}`,
);

vi.mock("@caffeineai/object-storage", () => ({
  StorageClient: class {
    getDirectURL = getDirectURL;
  },
}));

vi.mock("@icp-sdk/core/agent", () => ({
  HttpAgent: class {
    fetchRootKey = vi.fn().mockResolvedValue(undefined);
  },
}));

import { AdminPage } from "@/pages/Admin";

beforeEach(() => {
  setActor();
  getDirectURL.mockClear();
});

function renderAdminWithPhotos(photoIds: string[]) {
  const actor = setActor();
  actor.isCallerAdmin.mockResolvedValue(true);
  actor.listRequests.mockResolvedValue([makeJob({ id: 7n, photoIds })]);
  renderWithProviders(<AdminPage />);
  return actor;
}

describe("admin photo viewing resolves a displayable URL", () => {
  it("renders each attached photo with the URL the storage client resolved", async () => {
    renderAdminWithPhotos(["blob-a", "blob-b"]);

    const images = await waitFor(() => {
      const list = document.querySelector(
        '[data-ocid="admin.request_photos.1"]',
      );
      expect(list).not.toBeNull();
      const found = within(list as HTMLElement).getAllByRole("img");
      expect(found).toHaveLength(2);
      return found;
    });

    expect(images[0]).toHaveAttribute(
      "src",
      "https://gateway.test/v1/blob/?blob_hash=blob-a",
    );
    expect(images[1]).toHaveAttribute(
      "src",
      "https://gateway.test/v1/blob/?blob_hash=blob-b",
    );
    // The stored hash is what the resolver is asked to turn into a URL.
    expect(getDirectURL).toHaveBeenCalledWith("blob-a");
    expect(getDirectURL).toHaveBeenCalledWith("blob-b");
  });

  it("wraps the thumbnail in a link to the full-size URL that opens in a new tab", async () => {
    renderAdminWithPhotos(["blob-a"]);

    const link = await waitFor(() => {
      const item = document.querySelector(
        '[data-ocid="admin.request_photo.1.1"]',
      );
      expect(item).not.toBeNull();
      return within(item as HTMLElement).getByRole("link");
    });

    expect(link).toHaveAttribute(
      "href",
      "https://gateway.test/v1/blob/?blob_hash=blob-a",
    );
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noreferrer");
    // The whole thumbnail is the tap target on a phone.
    expect(within(link).getByRole("img")).toHaveAttribute(
      "src",
      "https://gateway.test/v1/blob/?blob_hash=blob-a",
    );
  });

  it("shows a fallback instead of a broken image when resolution fails", async () => {
    getDirectURL.mockRejectedValueOnce(new Error("gateway unavailable"));
    renderAdminWithPhotos(["blob-a"]);

    expect(await screen.findByText(/photo unavailable/i)).toBeInTheDocument();
    // No `<img>` is rendered for the failed photo, so the browser never shows
    // a broken-image icon.
    const item = document.querySelector(
      '[data-ocid="admin.request_photo.1.1"]',
    );
    expect(item).not.toBeNull();
    expect(within(item as HTMLElement).queryByRole("img")).toBeNull();
    // The rest of the request card still renders.
    expect(
      document.querySelector('[data-ocid="admin.request_card.1"]'),
    ).not.toBeNull();
  });
});
