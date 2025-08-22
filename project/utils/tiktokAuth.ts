// Mock TikTok login (later replace with real API integration)
export async function mockTikTokLogin() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: "tiktok-123",
        username: "mock_tiktok_user",
        provider: "tiktok" as const,
      });
    }, 1000); // simulate network delay
  });
}
