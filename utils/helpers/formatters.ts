export const formatPhoneNumber = (str: string | undefined) => {
  if (!str || str === "undefined" || typeof str !== "string") return "";
  const output = str
    .replace(/[\s|/]/g, "")
    .replace(/^\+?234\(0\)/, "")
    .replace(/^\+?2340*/, "");
  return output;
};

export const getMobileImageUrl = (str: string) => {
  if (str.startsWith("/")) {
    return str;
  }
  const urlSegments = str.split("/");
  const path = urlSegments
    .pop()
    ?.split(".")
    .slice(0, -1);
  return `${urlSegments.join("/")}/mobile-${path?.join(".")}.webp`;
};
