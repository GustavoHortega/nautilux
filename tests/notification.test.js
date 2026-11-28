jest.mock('../models', () => ({
    User: { findById: jest.fn() },
    Notification: {
        find: jest.fn(),
        create: jest.fn()
    }
}));

jest.mock('../services/vulnerabilityMatcher', () => ({
    matchUserVulnerabilities: jest.fn()
}));

jest.mock('../services/email/vulnerability', () => ({
    sendVulnerabilityNotification: jest.fn()
}));

const { User, Notification } = require('../models');
const { matchUserVulnerabilities } = require('../services/vulnerabilityMatcher');
const { sendVulnerabilityNotification } = require('../services/email/vulnerability');
const { findPendingNotifications } = require('../services/notificationMatcher');
const { sendPendingNotifications } = require('../services/notificationSender');

describe('Notification flow', () => {
    beforeEach(() => jest.clearAllMocks());

    test('filters vulnerabilities that were already notified to the user', async () => {
        matchUserVulnerabilities.mockResolvedValue([
            { vulnerability: { osvId: 'OSV-1' } },
            { vulnerability: { osvId: 'OSV-2' } }
        ]);
        Notification.find.mockReturnValue({
            select: jest.fn().mockResolvedValue([{ vulnerability: 'OSV-1' }])
        });

        const pending = await findPendingNotifications('user-1');

        expect(pending).toHaveLength(1);
        expect(pending[0].vulnerability.osvId).toBe('OSV-2');
    });

    test('sends the email and records the notification after successful delivery', async () => {
        const match = {
            technology: { name: 'express', version: '4.18.2' },
            vulnerability: { osvId: 'OSV-2' }
        };

        User.findById.mockResolvedValue({ email: 'gustavo@example.com' });
        matchUserVulnerabilities.mockResolvedValue([match]);
        Notification.find.mockReturnValue({
            select: jest.fn().mockResolvedValue([])
        });
        sendVulnerabilityNotification.mockResolvedValue({ messageId: 'mail-1' });
        Notification.create.mockResolvedValue({});

        const sent = await sendPendingNotifications('user-1');

        expect(sent).toBe(1);
        expect(sendVulnerabilityNotification).toHaveBeenCalledWith('gustavo@example.com', match);
        expect(Notification.create).toHaveBeenCalledWith(expect.objectContaining({
            user: 'user-1',
            vulnerability: 'OSV-2'
        }));
    });

    test('does not record a notification when email delivery fails', async () => {
        const match = {
            technology: { name: 'express', version: '4.18.2' },
            vulnerability: { osvId: 'OSV-2' }
        };

        User.findById.mockResolvedValue({ email: 'gustavo@example.com' });
        matchUserVulnerabilities.mockResolvedValue([match]);
        Notification.find.mockReturnValue({
            select: jest.fn().mockResolvedValue([])
        });
        sendVulnerabilityNotification.mockRejectedValue(new Error('SMTP unavailable'));

        await expect(sendPendingNotifications('user-1')).rejects.toThrow('SMTP unavailable');
        expect(Notification.create).not.toHaveBeenCalled();
    });
});
