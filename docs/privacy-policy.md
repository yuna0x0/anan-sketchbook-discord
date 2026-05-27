# Privacy Policy

**Last Updated:** May 27, 2026

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

#### Aggregated Bot Telemetry (Discord Analytics)
The Bot uses [Discord Analytics](https://discordanalytics.xyz/), a third-party service, to track aggregated usage statistics. The following data is transmitted periodically:

- **Bot Identity**: The Bot's Discord user ID, username, and avatar.
- **Aggregate Counts**: Total guild count, total member count across all guilds, and member-count distribution buckets.
- **Per-Guild Data**: For each guild the Bot is in: guild ID, guild name, guild icon, interaction count, and member count.
- **Interaction Metadata**: Command and component names, interaction types, and interaction locales, as aggregate counts only.
- **Aggregate User-Type Counts**: Counts of interactions by user category (administrator, moderator, new member, etc.) and guild locale distribution.

**Not Transmitted**: Individual user IDs, message content, command arguments (text input or uploaded images), generated images, and direct-message content are never sent to Discord Analytics.

Discord Analytics is operated from France and hosts data within the European Union. Their data handling is governed by their own [Privacy Policy](https://discordanalytics.xyz/docs/legals/privacy-policy) and [Terms of Service](https://discordanalytics.xyz/docs/legals/terms).

### 2.2 Data We DO NOT Collect

- Message content or chat history
- Personal information (name, email, address, etc.)
- User profile information beyond Discord User ID for rate limiting
- Voice data
- Direct message content
- Images you upload (processed in memory only, not stored)
- Text content you provide to commands (processed in memory only, not stored)
- Personalized analytics or telemetry tied to individual users (the Discord Analytics integration described in Section 2.1 transmits only aggregated metrics, never per-user behavior)
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
All operational data (server settings, rate-limit records, logs) is stored in a local SQLite database on the server hosting the Bot. Aggregated usage telemetry (see Section 2.1) is transmitted to Discord Analytics servers hosted in France. No other data is transmitted to third-party services except Discord's official API.

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
- **Discord Analytics**: Aggregated, non-personalized usage metrics are transmitted to Discord Analytics for the purpose of monitoring Bot health and usage (see Section 2.1 for the full list of data sent).
- **Legal Requirements**: If required by law or to protect our rights, we may disclose information to comply with legal processes.

## 6. Third-Party Services

The Bot interacts only with:

- **Discord API**: For receiving commands and sending responses. Discord's Privacy Policy applies to data processed by Discord.
- **Discord Analytics**: For aggregated usage analytics. Data is processed and hosted in France. See [Discord Analytics' Privacy Policy](https://discordanalytics.xyz/docs/legals/privacy-policy).

All image processing is performed locally. No images or text content provided to commands is sent to external services.

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

The Bot is operated from Taiwan. By using the Bot, you consent to your information being processed in Taiwan. Aggregated usage telemetry is additionally transferred to and processed in France by Discord Analytics. We will take reasonable steps to ensure your data is treated securely and in accordance with this Privacy Policy.

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
| Aggregated Telemetry (Discord Analytics) | Yes | Externally (France) | Per Discord Analytics' policy |
| Message Content | No | No | N/A |
| Uploaded Images | Processed | No | Immediate discard |
| Generated Images | Created | No | Sent to Discord only |
| Individual User Behavior (per-user analytics) | No | No | N/A |
| Personal Information | No | No | N/A |

---

By using the Anan Sketchbook Discord Bot, you acknowledge that you have read and understood this Privacy Policy.
