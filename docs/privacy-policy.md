# Privacy Policy

**Last Updated:** January 26, 2026

## 1. Introduction

This Privacy Policy explains how the Anan Sketchbook Discord Bot ("the Bot"), developed by yuna0x0 ("Developer", "we", "us", or "our") based in Taiwan, collects, uses, and protects information when you use our Bot.

We are committed to protecting your privacy and handling your data responsibly. This Bot is designed with privacy in mind and collects only the minimum data necessary to function.

## 2. Information We Collect

### 2.1 Data We DO Collect

#### Server Configuration Data
When a server administrator configures the Bot using the `/settings` command, we store:
- **Guild (Server) ID**: To identify which server the settings belong to.
- **Bot Settings**: Enable/disable status, default language preference.
- **Channel Permissions**: Which channels the Bot can operate in.
- **Command Permissions**: Per-command enable/disable status and role restrictions.
- **Rate Limit Settings**: Custom rate limit configurations set by administrators.

#### Rate Limit Usage Data
To enforce rate limits and prevent abuse:
- **User ID**: Temporarily stored to track command usage.
- **Timestamp**: When commands were used.
- **Guild ID and Command Name**: To apply correct rate limits.

**Important:** Rate limit usage data is automatically deleted after 1 hour through an automated database cleanup process.

#### Log Data
For operational and debugging purposes, the Bot may log:
- **Guild ID and Name**: To identify which server a command was executed in.
- **User ID and Username**: To identify who executed a command.
- **Command Name and Timestamp**: To track command usage.

**Note:** Command arguments (text input, uploaded images) and generated images are NOT logged.

Log data is retained on the server hosting the Bot and is used solely for troubleshooting and monitoring Bot health. Logs may be periodically rotated or cleared as part of normal server maintenance.

### 2.2 Data We DO NOT Collect

- Message content or chat history
- Personal information (name, email, address, etc.)
- User profile information beyond Discord User ID for rate limiting
- Voice data
- Direct message content
- Images you upload (processed in memory only, not stored)
- Text content you provide to commands (processed in memory only, not stored)
- Analytics or telemetry data
- Location data
- Device information

## 3. How We Use Your Information

The data we collect is used solely for:

- **Providing Bot Services**: Processing your commands and generating images.
- **Server Configuration**: Applying your server's custom settings and permissions.
- **Rate Limiting**: Preventing abuse and ensuring fair usage for all users.
- **Service Improvement**: Understanding usage patterns to improve the Bot (no personal data used).

## 4. Data Storage and Security

### 4.1 Storage Location
All data is stored in a local SQLite database on the server hosting the Bot. No data is transmitted to third-party services except Discord's official API.

### 4.2 Security Measures
- Database uses WAL (Write-Ahead Logging) mode for data integrity.
- Foreign key constraints ensure data consistency.
- The Bot runs with minimal required permissions.
- No sensitive personal data is collected or stored.

### 4.3 Data Retention
- **Server Settings**: Automatically deleted when the Bot is removed from the server.
- **Rate Limit Data**: Automatically deleted after 1 hour.
- **Log Data**: Retained for operational purposes; periodically rotated or cleared during server maintenance.
- **User-Uploaded Images**: Not stored; processed in memory and immediately discarded.
- **Generated Images**: Sent to Discord and not retained by the Bot.

## 5. Data Sharing

We do NOT sell, trade, or share your data with third parties except:

- **Discord**: Command interactions are processed through Discord's API as required for the Bot to function.
- **Legal Requirements**: If required by law or to protect our rights, we may disclose information to comply with legal processes.

## 6. Third-Party Services

The Bot interacts only with:

- **Discord API**: For receiving commands and sending responses. Discord's Privacy Policy applies to data processed by Discord.

All image processing is performed locally. No images or text content is sent to external services.

## 7. Your Rights

You have the right to:

### 7.1 Access Your Data
Server administrators can view their server's configuration through the `/settings` command.

### 7.2 Delete Your Data
- **Removing the Bot**: When the Bot is removed from a server, all associated server data (settings, permissions, rate limits) is automatically and immediately deleted. No action required.
- **Rate Limit Data**: Automatically deleted after 1 hour; no action required.
- **Manual Request**: Server administrators may also contact the Developer to request data deletion.

### 7.3 Data Portability
Server administrators may request an export of their server's configuration data.

## 8. Children's Privacy

The Bot is not directed at children under 13 years of age (or the minimum age required by Discord in your jurisdiction). We do not knowingly collect personal information from children. If you believe a child has provided us with personal data, please contact us immediately.

## 9. International Data Transfers

The Bot is operated from Taiwan. By using the Bot, you consent to your information being processed in Taiwan. We will take reasonable steps to ensure your data is treated securely and in accordance with this Privacy Policy.

## 10. Changes to This Policy

We may update this Privacy Policy from time to time. We will notify users of significant changes by updating the "Last Updated" date. Your continued use of the Bot after changes constitutes acceptance of the updated policy.

## 11. Discord's Terms

Your use of the Bot is also subject to Discord's Terms of Service and Privacy Policy. Please review Discord's policies for information about how Discord handles your data.

## 12. Contact Information

If you have questions about this Privacy Policy or wish to exercise your data rights, please contact:

- **Developer:** yuna0x0
- **GitHub:** https://github.com/yuna0x0

## 13. Summary

| Data Type | Collected | Stored | Retention |
|-----------|-----------|--------|-----------|
| Guild ID | Yes | Yes | Auto-deleted on bot removal |
| Server Settings | Yes | Yes | Auto-deleted on bot removal |
| User ID (rate limits) | Yes | Yes | 1 hour (auto-delete) |
| Log Data | Yes | Yes | Periodic rotation/cleanup |
| Message Content | No | No | N/A |
| Uploaded Images | Processed | No | Immediate discard |
| Generated Images | Created | No | Sent to Discord only |
| Personal Information | No | No | N/A |

---

By using the Anan Sketchbook Discord Bot, you acknowledge that you have read and understood this Privacy Policy.
