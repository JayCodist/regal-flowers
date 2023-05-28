export const formatPhoneNumber = (str: string | undefined) => {
  if (!str || str === "undefined" || typeof str !== "string") return "";
  const output = str
    .replace(/[\s|/]/g, "")
    .replace(/^\+?234\(0\)/, "")
    .replace(/^\+?2340*/, "");
  return output;
};
