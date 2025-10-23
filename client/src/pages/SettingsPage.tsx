export default function SettingsPage() {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Settings</h1>
      <div className="space-y-6">
        <div className="card p-6">
          <h2 className="text-xl font-semibold mb-4">Account Settings</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Email Notifications</label>
              <input type="checkbox" className="toggle" defaultChecked />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Push Notifications</label>
              <input type="checkbox" className="toggle" defaultChecked />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Dark Mode</label>
              <input type="checkbox" className="toggle" />
            </div>
          </div>
        </div>

        <div className="card p-6">
          <h2 className="text-xl font-semibold mb-4">Privacy</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Profile Visibility</label>
              <select className="input">
                <option>Public</option>
                <option>Private</option>
                <option>Friends Only</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
