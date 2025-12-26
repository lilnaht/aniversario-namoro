import {
  getCarouselImages,
  getLetters,
  getQuotes,
  getReasons,
  getSettings,
  getTimelinePosts,
} from "@/lib/data/public";
import AdminDashboardClient from "@/components/admin/AdminDashboardClient";

export default async function AdminDashboard() {
  const [settings, carouselImages, quotes, timelinePosts, letters, reasons] =
    await Promise.all([
      getSettings(),
      getCarouselImages(),
      getQuotes(),
      getTimelinePosts(),
      getLetters(),
      getReasons(),
    ]);

  return (
    <AdminDashboardClient
      settings={settings}
      carouselImages={carouselImages}
      quotes={quotes}
      timelinePosts={timelinePosts}
      letters={letters}
      reasons={reasons}
    />
  );
}
