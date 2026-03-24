import 'package:flutter/material.dart';

import '../app/app_theme.dart';

class SettingsScreen extends StatelessWidget {
  const SettingsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Settings'),
      ),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          _SettingsSection(
            title: 'Account',
            children: [
              _SettingsTile(
                icon: Icons.person,
                title: 'Profile',
                subtitle: 'Manage your account details',
                onTap: () {},
              ),
              _SettingsTile(
                icon: Icons.wallet,
                title: 'Wallet',
                subtitle: 'View wallet address and keys',
                onTap: () {},
              ),
              _SettingsTile(
                icon: Icons.security,
                title: 'Security',
                subtitle: '2FA, biometrics, PIN',
                onTap: () {},
              ),
            ],
          ),
          
          const SizedBox(height: 24),
          
          _SettingsSection(
            title: 'Preferences',
            children: [
              _SettingsTile(
                icon: Icons.language,
                title: 'Language',
                subtitle: 'English',
                onTap: () {},
              ),
              _SettingsTile(
                icon: Icons.currency_exchange,
                title: 'Default Currency',
                subtitle: 'USD',
                onTap: () {},
              ),
              _SettingsTile(
                icon: Icons.notifications,
                title: 'Notifications',
                subtitle: 'Enabled',
                onTap: () {},
              ),
              _SettingsTile(
                icon: Icons.dark_mode,
                title: 'Dark Mode',
                subtitle: 'System default',
                onTap: () {},
              ),
            ],
          ),
          
          const SizedBox(height: 24),
          
          _SettingsSection(
            title: 'About',
            children: [
              _SettingsTile(
                icon: Icons.info,
                title: 'About Nexus Pay',
                subtitle: 'Version 1.0.0',
                onTap: () {},
              ),
              _SettingsTile(
                icon: Icons.description,
                title: 'Terms of Service',
                onTap: () {},
              ),
              _SettingsTile(
                icon: Icons.privacy_tip,
                title: 'Privacy Policy',
                onTap: () {},
              ),
              _SettingsTile(
                icon: Icons.help,
                title: 'Help & Support',
                onTap: () {},
              ),
            ],
          ),
          
          const SizedBox(height: 24),
          
          // Hedera Info
          Card(
            child: Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  colors: [
                    AppTheme.primaryGreen.withOpacity(0.1),
                    AppTheme.primaryTeal.withOpacity(0.1),
                  ],
                ),
                borderRadius: BorderRadius.circular(16),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Container(
                        width: 40,
                        height: 40,
                        decoration: BoxDecoration(
                          gradient: AppTheme.primaryGradient,
                          borderRadius: BorderRadius.circular(10),
                        ),
                        child: const Icon(Icons.link, color: Colors.white),
                      ),
                      const SizedBox(width: 12),
                      const Text(
                        'Powered by Hedera',
                        style: TextStyle(fontWeight: FontWeight.w600),
                      ),
                    ],
                  ),
                  const SizedBox(height: 12),
                  const Text(
                    'Nexus Pay runs on Hedera\'s enterprise-grade blockchain, providing fast, secure, and low-cost transactions.',
                    style: TextStyle(fontSize: 14),
                  ),
                  const SizedBox(height: 12),
                  Row(
                    children: [
                      _HederaStat(label: 'Network', value: 'Testnet'),
                      const SizedBox(width: 16),
                      _HederaStat(label: 'Account', value: '0.0.123456'),
                    ],
                  ),
                ],
              ),
            ),
          ),
          
          const SizedBox(height: 24),
          
          // Logout Button
          OutlinedButton(
            onPressed: () {},
            style: OutlinedButton.styleFrom(
              foregroundColor: AppTheme.redAccent,
              side: const BorderSide(color: AppTheme.redAccent),
              padding: const EdgeInsets.symmetric(vertical: 16),
            ),
            child: const Text('Log Out'),
          ),
        ],
      ),
    );
  }
}

class _SettingsSection extends StatelessWidget {
  final String title;
  final List<Widget> children;

  const _SettingsSection({
    required this.title,
    required this.children,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          title,
          style: Theme.of(context).textTheme.titleSmall?.copyWith(
            color: AppTheme.gray500,
          ),
        ),
        const SizedBox(height: 8),
        Card(
          child: Column(
            children: children,
          ),
        ),
      ],
    );
  }
}

class _SettingsTile extends StatelessWidget {
  final IconData icon;
  final String title;
  final String? subtitle;
  final VoidCallback onTap;

  const _SettingsTile({
    required this.icon,
    required this.title,
    this.subtitle,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return ListTile(
      leading: Container(
        width: 40,
        height: 40,
        decoration: BoxDecoration(
          color: AppTheme.gray100,
          borderRadius: BorderRadius.circular(10),
        ),
        child: Icon(icon, color: AppTheme.gray600, size: 20),
      ),
      title: Text(title),
      subtitle: subtitle != null ? Text(subtitle!) : null,
      trailing: const Icon(Icons.chevron_right),
      onTap: onTap,
    );
  }
}

class _HederaStat extends StatelessWidget {
  final String label;
  final String value;

  const _HederaStat({required this.label, required this.value});

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          label,
          style: Theme.of(context).textTheme.bodySmall,
        ),
        Text(
          value,
          style: Theme.of(context).textTheme.bodyMedium?.copyWith(
            fontWeight: FontWeight.w500,
          ),
        ),
      ],
    );
  }
}
