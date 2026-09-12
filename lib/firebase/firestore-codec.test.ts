import { describe, expect, it } from "vitest";

import {
  firestoreDocId,
  firestoreDocumentsUrl,
  fromFirestoreFields,
  toFirestoreFields,
  toFirestoreValue,
} from "@/lib/firebase/firestore-codec";

describe("firestore codec", () => {
  it("round-trips nested CMS-like payloads", () => {
    const input = {
      slug: "hong-hac-city",
      displayNameVi: "Hồng Hạc City",
      siteArea: 12.5,
      units: 10,
      tags: ["a", "b"],
      coordinates: { lat: 10.1, lng: null },
      empty: [],
    };
    const fields = toFirestoreFields(input);
    expect(toFirestoreValue(10)).toEqual({ integerValue: "10" });
    expect(fromFirestoreFields(fields)).toEqual(input);
  });

  it("round-trips a real project coordinate pair (Aristo, from the verified catalog dump) with no precision loss", () => {
    const input = { coordinates: { lat: 10.719602, lng: 106.716154 } };
    const fields = toFirestoreFields(input);
    expect(fromFirestoreFields(fields)).toEqual(input);
  });

  it("skips undefined keys", () => {
    expect(toFirestoreFields({ a: 1, b: undefined })).toEqual({ a: { integerValue: "1" } });
  });

  it("builds document URLs and ids", () => {
    expect(firestoreDocId("projects/x/databases/(default)/documents/projects/hong-hac-city")).toBe(
      "hong-hac-city",
    );
    expect(firestoreDocumentsUrl("de-division", "projects/hong-hac-city", "key")).toContain(
      "projects/de-division/databases/(default)/documents/projects/hong-hac-city?key=key",
    );
  });
});
