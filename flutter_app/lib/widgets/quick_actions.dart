import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import '../app/app_theme.dart';

class QuickActions extends StatelessWidget {
  const QuickActions({super.key});

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'Quick Actions',
          style: Theme.of(context).textTheme.titleMedium,
        ),
        const SizedBox(height: 12),
        Row(
          children: [
            _ActionButton(
              icon: Icons.send,
              label: 'Send',
              color: AppTheme.primaryGreen,
              onTap: () => context.push('/send'),
            ),
            const SizedBox(width: 12),
            _ActionButton(
              icon: Icons.qr_code_scanner,
              label: 'Scan QR',
              color: AppTheme.purpleAccent,
              onTap: () {},
            ),
            const SizedBox(width: 12),
            _ActionButton(
              icon: Icons.account_balance_wallet,
              label: 'Top Up',
              color: AppTheme.orangeAccent,
              onTap: () {},
            ),
            const SizedBox(width: 12),
            _ActionButton(
              icon: Icons.history,
              label: 'History',
              color: AppTheme.primaryCyan,
              onTap: () => context.push('/history'),
            ),
          ],
        ),
      ],
    );
  }
}

class _ActionButton extends StatelessWidget {
  final IconData icon;
  final String label;
  final Color color;
  final VoidCallback onTap;

  const _ActionButton({
    required this.icon,
    required this.label,
    required this.color,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return Expanded(
      child: GestureDetector(
        onTap: onTap,
        child: Container(
          padding: const EdgeInsets.symmetric(vertical: 16),
          decoration: BoxDecoration(
            color: color.withOpacity(0.1),
            borderRadius: BorderRadius.circular(16),
            border: Border.all(color: color.withOpacity(0.2)),
          ),
          child: Column(
            children: [
              Container(
                width: 40,
                height: 40,
                decoration: BoxDecoration(
                  color: color,
                  shape: BoxShape.circle,
                ),
                child: Icon(icon, color: Colors.white, size: 20),
              ),
              const SizedBox(height: 8),
              Text(
                label,
                style: Theme.of(context).textTheme.bodySmall,
              ),
            ],
          ),
        ),
      ),
    );
  }
}
