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
 * The object-storage module is mocked locally so the admin photo surface can be
 * observed without a network or a real gateway. Both entry points the app may
 * use to turn a stored photo key into a URL are provided: the current
 * `ExternalBlob.fromURL` and the `StorageClient.getDirectURL` the accepted
 * mobile-photo fix is expected to use. The mock is deliberately implementation
 * agnostic — this file pins the *rendering contract* around a photo, not which
 * helper resolves its URL, so it stays valid across the fix.
 */
vi.mock("@caffeineai/object-storage", () => ({
  ExternalBlob: {
    fromURL: (url: string) => ({
      getDirectURL: () => url,
    }),
  },
  StorageClient: class {
    getDirectURL = async (hash: string) =>
      `https://gateway.test/v1/blob/?blob_hash=${hash}`;
  },
}));

/**
 * `resolvePhotoUrl` builds an `HttpAgent` and, for a localhost host, awaits
 * `fetchRootKey()`. jsdom has no replica to answer that call, so the real agent
 * would leave the promise pending forever and the photo would never render.
 * Stub the agent so the resolution path the component observes can complete.
 */
vi.mock("@icp-sdk/core/agent", () => ({
  HttpAgent: class {
    fetchRootKey = vi.fn().mockResolvedValue(undefined);
  },
}));

import { AdminPage } from "@/pages/Admin";

/**
 * Characterization baseline for the owner's photo-viewing surface, which the
 * accepted "photos viewable on any device, including mobile" requirement must
 * not break.
 *
 * The request intentionally changes how a stored photo key is turned into a
 * displayable URL, so the resolved URL value itself is deliberately NOT
 * asserted here. What is pinned is the adjacent working behavior that must
 * survive the change:
 *
 *  - every attached photo renders as a real `<img>` with a descriptive alt, so
 *    a mobile browser has an image element to display;
 *  - each image is wrapped in a link that opens in a new tab, so tapping a
 *    thumbnail on a phone opens the full-size photo;
 *  - a request with no photos shows the empty state and no photo list;
 *  - the photo list is scoped to its own request card.
 */
beforeEach(() => {
  setActor();
});

function renderAdminWithPhotos(photoIds: string[]) {
  const actor = setActor();
  actor.isCallerAdmin.mockResolvedValue(true);
  actor.listRequests.mockResolvedValue([makeJob({ id: 7n, photoIds })]);
  renderWithProviders(<AdminPage />);
  return actor;
}

describe("admin request photo viewing", () => {
  it("renders each attached photo as an image with a descriptive alt", async () => {
    renderAdminWithPhotos(["blob-a", "blob-b"]);

    // URL resolution is asynchronous, so wait for the images themselves rather
    // than only the list container that renders before they resolve.
    const images = await waitFor(() => {
      const list = document.querySelector(
        '[data-ocid="admin.request_photos.1"]',
      );
      expect(list).not.toBeNull();
      const found = within(list as HTMLElement).getAllByRole("img");
      expect(found).toHaveLength(2);
      return found;
    });

    expect(images[0]).toHaveAttribute("alt", "Job attachment 1 for request 1");
    expect(images[1]).toHaveAttribute("alt", "Job attachment 2 for request 1");
    // A mobile browser needs a non-empty source to display anything.
    for (const image of images) {
      expect(image.getAttribute("src")).toBeTruthy();
    }
  });

  it("wraps each photo in a link that opens in a new tab", async () => {
    renderAdminWithPhotos(["blob-a"]);

    const link = await waitFor(() => {
      const item = document.querySelector(
        '[data-ocid="admin.request_photo.1.1"]',
      );
      expect(item).not.toBeNull();
      return within(item as HTMLElement).getByRole("link");
    });

    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noreferrer");
    expect(link.getAttribute("href")).toBeTruthy();
    // The image is the link's content, so the whole thumbnail is tappable.
    expect(within(link).getByRole("img")).toHaveAttribute(
      "alt",
      "Job attachment 1 for request 1",
    );
  });

  it("shows the empty state and no photo list when a request has no photos", async () => {
    renderAdminWithPhotos([]);

    expect(
      await screen.findByText(/no photos were attached to this request/i),
    ).toBeInTheDocument();
    expect(
      document.querySelector('[data-ocid="admin.request_photos.1"]'),
    ).toBeNull();
    expect(
      document.querySelector('[data-ocid="admin.request_photos_empty.1"]'),
    ).not.toBeNull();
  });

  it("scopes each request's photos to its own card", async () => {
    const actor = setActor();
    actor.isCallerAdmin.mockResolvedValue(true);
    actor.listRequests.mockResolvedValue([
      makeJob({ id: 7n, photoIds: ["blob-a"] }),
      makeJob({ id: 8n, photoIds: [] }),
    ]);

    renderWithProviders(<AdminPage />);

    await waitFor(() => {
      expect(
        document.querySelector('[data-ocid="admin.request_photos.1"]'),
      ).not.toBeNull();
    });
    expect(
      document.querySelector('[data-ocid="admin.request_photos.2"]'),
    ).toBeNull();
    expect(
      document.querySelector('[data-ocid="admin.request_photos_empty.2"]'),
    ).not.toBeNull();
  });
});
