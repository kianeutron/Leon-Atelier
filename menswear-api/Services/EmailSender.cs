using System.Net;
using System.Net.Mail;

namespace MensWear.Api.Services;

public interface IEmailSender
{
    Task SendAsync(string toEmail, string subject, string htmlBody, string? textBody = null, CancellationToken ct = default);
}

public class SmtpEmailSender : IEmailSender
{
    private readonly string _host;
    private readonly int _port;
    private readonly string _from;
    private readonly string? _user;
    private readonly string? _pass;
    private readonly bool _enableSsl;

    public SmtpEmailSender(string host, int port, string from, string? user, string? pass, bool enableSsl)
    {
        _host = host;
        _port = port;
        _from = from;
        _user = user;
        _pass = pass;
        _enableSsl = enableSsl;
    }

    public async Task SendAsync(string toEmail, string subject, string htmlBody, string? textBody = null, CancellationToken ct = default)
    {
        using var msg = new MailMessage();
        msg.From = new MailAddress(_from);
        msg.To.Add(new MailAddress(toEmail));
        msg.Subject = subject;
        msg.Body = string.IsNullOrWhiteSpace(textBody) ? htmlBody : textBody + "\n\n" + htmlBody;
        msg.IsBodyHtml = true;

        using var client = new SmtpClient(_host, _port)
        {
            EnableSsl = _enableSsl,
            DeliveryMethod = SmtpDeliveryMethod.Network,
            UseDefaultCredentials = false,
            Credentials = string.IsNullOrWhiteSpace(_user) ? CredentialCache.DefaultNetworkCredentials : new NetworkCredential(_user, _pass)
        };
        await client.SendMailAsync(msg, ct);
    }
}
