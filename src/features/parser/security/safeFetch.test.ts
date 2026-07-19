import { describe, it, expect } from "vitest";
import {
  isPrivateOrReservedIPAddress,
  validateResponseSheetUrlFormat,
} from "./safeFetch";
import { ParserError } from "./errors";

describe("isPrivateOrReservedIPAddress", () => {
  it("flags loopback addresses", () => {
    expect(isPrivateOrReservedIPAddress("127.0.0.1")).toBe(true);
    expect(isPrivateOrReservedIPAddress("::1")).toBe(true);
  });

  it("flags private IPv4 ranges", () => {
    expect(isPrivateOrReservedIPAddress("10.0.0.5")).toBe(true);
    expect(isPrivateOrReservedIPAddress("172.16.0.1")).toBe(true);
    expect(isPrivateOrReservedIPAddress("192.168.1.1")).toBe(true);
  });

  it("flags the cloud metadata link-local address", () => {
    expect(isPrivateOrReservedIPAddress("169.254.169.254")).toBe(true);
  });

  it("flags IPv6 unique-local and link-local ranges", () => {
    expect(isPrivateOrReservedIPAddress("fc00::1")).toBe(true);
    expect(isPrivateOrReservedIPAddress("fe80::1")).toBe(true);
  });

  it("allows a normal public IPv4 address", () => {
    expect(isPrivateOrReservedIPAddress("8.8.8.8")).toBe(false);
  });

  it("treats an unparseable value as unsafe", () => {
    expect(isPrivateOrReservedIPAddress("not-an-ip")).toBe(true);
  });
});

describe("validateResponseSheetUrlFormat", () => {
  it("accepts a well-formed https URL", () => {
    expect(() => validateResponseSheetUrlFormat("https://digialm.com/answersheet/1")).not.toThrow();
  });

  it("rejects malformed URLs", () => {
    expect(() => validateResponseSheetUrlFormat("not a url")).toThrow(ParserError);
  });

  it("rejects non-http(s) protocols", () => {
    expect(() => validateResponseSheetUrlFormat("ftp://example.com/file")).toThrow(ParserError);
    expect(() => validateResponseSheetUrlFormat("file:///etc/passwd")).toThrow(ParserError);
  });

  it("rejects localhost", () => {
    expect(() => validateResponseSheetUrlFormat("http://localhost:3000/admin")).toThrow(ParserError);
  });

  it("rejects the literal 0.0.0.0 hostname", () => {
    expect(() => validateResponseSheetUrlFormat("http://0.0.0.0/")).toThrow(ParserError);
  });
});
