package com.example.petnestspring.email;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.AllArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class EmailService implements EmailSender {

    private static final Logger LOGGER = LoggerFactory.getLogger(EmailService.class);
    private final JavaMailSender mailSender;

    @Override
    @Async
    public void send(String to, String email) {
        try {
            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, "utf-8");
            helper.setText(email, true);
            helper.setTo(to);
            helper.setSubject("Confirm your email");
            helper.setFrom("hello@petnest.com");
            mailSender.send(mimeMessage);
            LOGGER.info("Email sent successfully to {}", to);
        } catch (MessagingException e) {
            LOGGER.error("Error while sending email to {}: {}", to, e.getMessage());
            throw new RuntimeException("Failed to send email due to messaging exception", e);
        } catch (Exception e) {
            LOGGER.error("Unexpected error while sending email to {}: {}", to, e.getMessage());
            throw new RuntimeException("Failed to send email due to unexpected error", e);
        }
    }
}
