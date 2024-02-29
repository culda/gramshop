import { validateDataFromTelegram } from "./validate";

describe("validateDataFromTelegram", () => {
  it("should return true when the computed hash matches the provided hash", () => {
    const dataCheckString =
      "query_id=AAH6VnFUAAAAAPpWcVQ5KpN-&user=%7B%22id%22%3A1416713978%2C%22first_name%22%3A%22Bogdan%22%2C%22last_name%22%3A%22Culda%22%2C%22username%22%3A%22biigdab%22%2C%22language_code%22%3A%22en%22%2C%22is_premium%22%3Atrue%2C%22allows_write_to_pm%22%3Atrue%7D&auth_date=1709197538&hash=e9c088b78f7244cdfa1d2675cfae83e72b409b3aaea58cf2b9836429ad8085e0";
    const botToken = "6491571682:AAFpv1_jUUF7UvZAoZmvZAiDBa0wRegrdXU";

    const result = validateDataFromTelegram(dataCheckString, botToken);

    expect(result).toBe(true);
  });

  //   it("should return false when the computed hash does not match the provided hash", () => {
  //     const dataCheckString =
  //       "query_id=AAH6VnFUAAAAAPpWcVQ5KpN-&user=%7B%22id%22%3A1416713978%2C%22first_name%22%3A%22Bogdan%22%2C%22last_name%22%3A%22Culda%22%2C%22username%22%3A%22biigdab%22%2C%22language_code%22%3A%22en%22%2C%22is_premium%22%3Atrue%2C%22allows_write_to_pm%22%3Atrue%7D&auth_date=1709197538&hash=e9c088b78f7244cdfa1d2675cfae83e72b409b3aaea58cf2b9836429ad8085e0";
  //     const hash =
  //       "e9c088b78f7244cdfa1d2675cfae83e72b409b3aaea58cf2b9836429ad8085e1";
  //     const botToken = "6491571682:AAFpv1_jUUF7UvZAoZmvZAiDBa0wRegrdXU";

  //     const result = validateDataFromTelegram(dataCheckString, hash, botToken);

  //     expect(result).toBe(false);
  //   });
});
