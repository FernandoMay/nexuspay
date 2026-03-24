import 'package:flutter/material.dart';

import '../app/app_theme.dart';

class AIAssistantScreen extends StatefulWidget {
  const AIAssistantScreen({super.key});

  @override
  State<AIAssistantScreen> createState() => _AIAssistantScreenState();
}

class _AIAssistantScreenState extends State<AIAssistantScreen> {
  final _messageController = TextEditingController();
  final List<_ChatMessage> _messages = [
    _ChatMessage(
      role: 'assistant',
      content: '👋 Hi! I\'m your Nexus AI agent. I analyze markets 24/7 to find the best transfer opportunities for you.',
    ),
  ];

  @override
  void dispose() {
    _messageController.dispose();
    super.dispose();
  }

  void _sendMessage() {
    if (_messageController.text.isEmpty) return;
    
    setState(() {
      _messages.add(_ChatMessage(
        role: 'user',
        content: _messageController.text,
      ));
    });
    
    _messageController.clear();
    
    // Simulate AI response
    Future.delayed(const Duration(seconds: 1), () {
      setState(() {
        _messages.add(_ChatMessage(
          role: 'assistant',
          content: '📊 **Market Analysis: MXN → PEN**\n\nCurrent rate: **1 MXN = 0.18 PEN**\n\nBased on my analysis, the rate may improve in 2-3 hours. Confidence: 78%',
        ));
      });
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Container(
              width: 32,
              height: 32,
              decoration: BoxDecoration(
                gradient: AppTheme.accentGradient,
                shape: BoxShape.circle,
              ),
              child: const Icon(Icons.smart_toy, color: Colors.white, size: 18),
            ),
            const SizedBox(width: 8),
            const Text('AI Agent'),
          ],
        ),
        actions: [
          Container(
            margin: const EdgeInsets.only(right: 16),
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
            decoration: BoxDecoration(
              color: AppTheme.primaryGreen.withOpacity(0.1),
              borderRadius: BorderRadius.circular(20),
            ),
            child: Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                Container(
                  width: 8,
                  height: 8,
                  decoration: const BoxDecoration(
                    color: AppTheme.primaryGreen,
                    shape: BoxShape.circle,
                  ),
                ),
                const SizedBox(width: 6),
                const Text(
                  'Active',
                  style: TextStyle(
                    color: AppTheme.primaryGreen,
                    fontSize: 12,
                    fontWeight: FontWeight.w500,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
      body: Column(
        children: [
          // Chat Messages
          Expanded(
            child: ListView.builder(
              padding: const EdgeInsets.all(16),
              itemCount: _messages.length,
              itemBuilder: (context, index) {
                final message = _messages[index];
                return _ChatBubble(message: message);
              },
            ),
          ),
          
          // Quick Suggestions
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
            child: SingleChildScrollView(
              scrollDirection: Axis.horizontal,
              child: Row(
                children: [
                  _SuggestionChip(
                    label: 'Best time to send?',
                    onTap: () {
                      _messageController.text = 'What\'s the best time to send MXN to PEN?';
                      _sendMessage();
                    },
                  ),
                  const SizedBox(width: 8),
                  _SuggestionChip(
                    label: 'Show current rates',
                    onTap: () {
                      _messageController.text = 'Show me current rates';
                      _sendMessage();
                    },
                  ),
                  const SizedBox(width: 8),
                  _SuggestionChip(
                    label: 'Optimize my transfer',
                    onTap: () {
                      _messageController.text = 'Optimize my transfer';
                      _sendMessage();
                    },
                  ),
                ],
              ),
            ),
          ),
          
          // Input Field
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: Theme.of(context).colorScheme.surface,
              border: Border(
                top: BorderSide(color: Theme.of(context).dividerColor),
              ),
            ),
            child: Row(
              children: [
                Expanded(
                  child: TextField(
                    controller: _messageController,
                    decoration: const InputDecoration(
                      hintText: 'Ask about rates, timing, or optimization...',
                      border: InputBorder.none,
                    ),
                    onSubmitted: (_) => _sendMessage(),
                  ),
                ),
                Container(
                  decoration: BoxDecoration(
                    gradient: AppTheme.accentGradient,
                    shape: BoxShape.circle,
                  ),
                  child: IconButton(
                    icon: const Icon(Icons.send, color: Colors.white),
                    onPressed: _sendMessage,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class _ChatMessage {
  final String role;
  final String content;

  _ChatMessage({required this.role, required this.content});
}

class _ChatBubble extends StatelessWidget {
  final _ChatMessage message;

  const _ChatBubble({required this.message});

  @override
  Widget build(BuildContext context) {
    final isUser = message.role == 'user';
    
    return Align(
      alignment: isUser ? Alignment.centerRight : Alignment.centerLeft,
      child: Container(
        margin: const EdgeInsets.only(bottom: 16),
        constraints: BoxConstraints(
          maxWidth: MediaQuery.of(context).size.width * 0.8,
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            if (!isUser) ...[
              Container(
                width: 32,
                height: 32,
                decoration: BoxDecoration(
                  gradient: AppTheme.accentGradient,
                  shape: BoxShape.circle,
                ),
                child: const Icon(Icons.smart_toy, color: Colors.white, size: 16),
              ),
              const SizedBox(width: 8),
            ],
            Flexible(
              child: Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: isUser 
                    ? AppTheme.primaryGreen 
                    : Theme.of(context).colorScheme.surface,
                  borderRadius: BorderRadius.circular(16),
                  border: isUser 
                    ? null 
                    : Border.all(color: Theme.of(context).dividerColor),
                ),
                child: Text(
                  message.content,
                  style: TextStyle(
                    color: isUser ? Colors.white : null,
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _SuggestionChip extends StatelessWidget {
  final String label;
  final VoidCallback onTap;

  const _SuggestionChip({required this.label, required this.onTap});

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
        decoration: BoxDecoration(
          color: Theme.of(context).colorScheme.surface,
          borderRadius: BorderRadius.circular(20),
          border: Border.all(color: AppTheme.purpleAccent.withOpacity(0.3)),
        ),
        child: Text(
          label,
          style: const TextStyle(
            color: AppTheme.purpleAccent,
            fontWeight: FontWeight.w500,
          ),
        ),
      ),
    );
  }
}
