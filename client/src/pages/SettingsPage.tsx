import { FC, useState } from 'react';
import { useForm } from 'react-hook-form';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Textarea from '../components/common/Textarea';
import { useAppSelector } from '../hooks/redux';
import { useToast } from '../hooks/useToast';

interface SettingsFormData {
  displayName: string;
  bio: string;
  location: string;
  website: string;
}

const SettingsPage: FC = () => {
  const { user } = useAppSelector((state) => state.auth);
  const toast = useToast();
  const [activeTab, setActiveTab] = useState<'account' | 'privacy' | 'notifications'>('account');
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SettingsFormData>({
    defaultValues: {
      displayName: user?.displayName || '',
      bio: user?.bio || '',
      location: user?.location || '',
      website: user?.website || '',
    },
  });

  const onSubmit = async (data: SettingsFormData) => {
    setIsLoading(true);
    try {
      // API call would go here
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success('Settings saved successfully!');
    } catch (error) {
      toast.error('Failed to save settings');
    } finally {
      setIsLoading(false);
    }
  };

  const tabs = [
    { id: 'account', label: 'Account' },
    { id: 'privacy', label: 'Privacy' },
    { id: 'notifications', label: 'Notifications' },
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Settings</h1>

      <div className="card">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-primary-600 text-primary-600 dark:text-primary-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'account' && (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold mb-4">Profile Information</h2>
                
                <div className="space-y-4">
                  <Input
                    {...register('displayName')}
                    label="Display Name"
                    error={errors.displayName?.message}
                  />

                  <Textarea
                    {...register('bio')}
                    label="Bio"
                    rows={4}
                    error={errors.bio?.message}
                    helperText="Tell us about yourself"
                  />

                  <Input
                    {...register('location')}
                    label="Location"
                    placeholder="City, Country"
                    error={errors.location?.message}
                  />

                  <Input
                    {...register('website')}
                    label="Website"
                    placeholder="https://example.com"
                    error={errors.website?.message}
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button type="submit" variant="primary" loading={isLoading}>
                  Save Changes
                </Button>
              </div>
            </form>
          )}

          {activeTab === 'privacy' && (
            <div>
              <h2 className="text-lg font-semibold mb-4">Privacy Settings</h2>
              <div className="space-y-4">
                <label className="flex items-center justify-between p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer">
                  <div>
                    <p className="font-medium">Private Account</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Only followers can see your posts
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    className="w-5 h-5 text-primary-600 rounded focus:ring-primary-500"
                  />
                </label>

                <label className="flex items-center justify-between p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer">
                  <div>
                    <p className="font-medium">Show Online Status</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Let others see when you're online
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    defaultChecked
                    className="w-5 h-5 text-primary-600 rounded focus:ring-primary-500"
                  />
                </label>

                <label className="flex items-center justify-between p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer">
                  <div>
                    <p className="font-medium">Allow Tagging</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Let others tag you in posts
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    defaultChecked
                    className="w-5 h-5 text-primary-600 rounded focus:ring-primary-500"
                  />
                </label>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div>
              <h2 className="text-lg font-semibold mb-4">Notification Preferences</h2>
              <div className="space-y-4">
                <label className="flex items-center justify-between p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer">
                  <div>
                    <p className="font-medium">Push Notifications</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Receive push notifications
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    defaultChecked
                    className="w-5 h-5 text-primary-600 rounded focus:ring-primary-500"
                  />
                </label>

                <label className="flex items-center justify-between p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer">
                  <div>
                    <p className="font-medium">Email Notifications</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Receive notifications via email
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    defaultChecked
                    className="w-5 h-5 text-primary-600 rounded focus:ring-primary-500"
                  />
                </label>

                <label className="flex items-center justify-between p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer">
                  <div>
                    <p className="font-medium">Likes & Comments</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Get notified when someone likes or comments
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    defaultChecked
                    className="w-5 h-5 text-primary-600 rounded focus:ring-primary-500"
                  />
                </label>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
