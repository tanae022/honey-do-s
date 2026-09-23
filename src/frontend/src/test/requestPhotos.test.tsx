import {
  installCoreInfrastructureMocks,
  renderWithProviders,
  setActor,
} from "@/test/harness";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
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
  useSearch: () => ({}),
}));

/**
 * The request form's photo-upload behavior is adjacent to the own-parts/supplies
 * checkbox this request adds to the same form. The six-photo cap, the uploaded
 * photo ids carried into the submitted request, and photo removal are existing
 * working behavior that must survive the form change, so they are pinned here.
 *
 * `StorageClient` is mocked locally: no network, no real object storage. The
 * upload resolves immediately so the test observes the form's own state machine
 * rather than the storage integration.
 */
const putFile = vi.fn(
  async (
    _bytes: Uint8Array,
    onProgress?: (percentage: number) => void,
  ): Promise<{ hash: string }> => {
    onProgress?.(100);
    return { hash: `blob-${putFile.mock.calls.length}` };
  },
);

vi.mock("@caffeineai/object-storage", () => ({
  StorageClient: class {
    putFile = putFile;
  },
}));

vi.mock("@icp-sdk/core/agent", () => ({
  HttpAgent: class {
    fetchRootKey = vi.fn().mockResolvedValue(undefined);
  },
}));

import { RequestPage } from "@/pages/Request";

// jsdom does not implement the object-URL API the form uses for local photo
// previews. Stub it so the form's own state machine can be observed; no real
// blob URL is needed.
if (typeof URL.createObjectURL !== "function") {
  Object.defineProperty(URL, "createObjectURL", {
    writable: true,
    configurable: true,
    value: vi.fn(() => "blob:preview"),
  });
}
if (typeof URL.revokeObjectURL !== "function") {
  Object.defineProperty(URL, "revokeObjectURL", {
    writable: true,
    configurable: true,
    value: vi.fn(),
  });
}
// jsdom's File does not implement `arrayBuffer()`, which the form calls before
// uploading. Polyfill it so the form's upload path can run.
if (typeof File.prototype.arrayBuffer !== "function") {
  Object.defineProperty(File.prototype, "arrayBuffer", {
    writable: true,
    configurable: true,
    value: function arrayBuffer(this: File): Promise<ArrayBuffer> {
      return Promise.resolve(new ArrayBuffer(0));
    },
  });
}

beforeEach(() => {
  setActor();
  putFile.mockClear();
});

function makeImageFile(name: string): File {
  return new File([new Uint8Array([1, 2, 3])], name, { type: "image/png" });
}

async function fillValidForm(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByLabelText(/your name/i), "Jamie Rivera");
  await user.type(screen.getByLabelText(/^email$/i), "jamie@example.com");
  await user.type(screen.getByLabelText(/^phone$/i), "(555) 123-4567");
  await user.type(
    screen.getByLabelText(/when works best/i),
    "Weekday mornings",
  );
  await user.type(
    screen.getByLabelText(/what needs doing/i),
    "The kitchen faucet drips constantly.",
  );
}

describe("request form photo uploads", () => {
  it("caps the number of attached photos at six", async () => {
    const user = userEvent.setup();
    renderWithProviders(<RequestPage />);

    const input = document.querySelector(
      '[data-ocid="request.photo_input"]',
    ) as HTMLInputElement;
    expect(input).not.toBeNull();

    await user.upload(input, [
      makeImageFile("one.png"),
      makeImageFile("two.png"),
      makeImageFile("three.png"),
      makeImageFile("four.png"),
      makeImageFile("five.png"),
      makeImageFile("six.png"),
      makeImageFile("seven.png"),
    ]);

    await waitFor(() => {
      expect(
        document.querySelectorAll('[data-ocid^="request.photo_item."]'),
      ).toHaveLength(6);
    });
    // The upload control disables itself once the cap is reached.
    expect(
      screen.getByRole("button", { name: /photo limit reached/i }),
    ).toBeDisabled();
  });

  it("submits the uploaded photo ids with the request", async () => {
    const actor = setActor();
    actor.submitRequest.mockResolvedValue("HD-4F2A9C");
    const user = userEvent.setup();
    renderWithProviders(<RequestPage />);

    const input = document.querySelector(
      '[data-ocid="request.photo_input"]',
    ) as HTMLInputElement;
    await user.upload(input, [makeImageFile("one.png")]);

    await waitFor(() => {
      expect(
        document.querySelectorAll('[data-ocid^="request.photo_item."]'),
      ).toHaveLength(1);
    });

    await fillValidForm(user);
    await user.click(screen.getByRole("button", { name: /send my request/i }));

    await waitFor(() => {
      expect(actor.submitRequest).toHaveBeenCalledTimes(1);
    });
    expect(actor.submitRequest.mock.calls[0][0]).toMatchObject({
      photoIds: ["blob-1"],
    });
  });

  it("lets the guest remove an attached photo before submitting", async () => {
    const user = userEvent.setup();
    renderWithProviders(<RequestPage />);

    const input = document.querySelector(
      '[data-ocid="request.photo_input"]',
    ) as HTMLInputElement;
    await user.upload(input, [makeImageFile("one.png")]);

    await waitFor(() => {
      expect(
        document.querySelectorAll('[data-ocid^="request.photo_item."]'),
      ).toHaveLength(1);
    });

    await user.click(screen.getByRole("button", { name: /remove photo 1/i }));

    await waitFor(() => {
      expect(
        document.querySelectorAll('[data-ocid^="request.photo_item."]'),
      ).toHaveLength(0);
    });
  });
});
