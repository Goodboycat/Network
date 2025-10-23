export default function NotificationsPage() {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Notifications</h1>
      <div className="card p-12 text-center">
        <div className="text-6xl mb-4">🔔</div>
        <h3 className="text-xl font-semibold mb-2">All Caught Up</h3>
        <p className="text-gray-600 dark:text-gray-400">
          You're all up to date with your notifications
        </p>
      </div>
    </div>
  );
}
