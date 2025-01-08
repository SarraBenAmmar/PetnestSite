package com.example.petnestspring.Auth;


import com.example.petnestspring.Auth.token.ConfirmationToken;
import com.example.petnestspring.Auth.token.ConfirmationTokenService;
import com.example.petnestspring.config.JwtService;
import com.example.petnestspring.Entities.User;
import com.example.petnestspring.Entities.enm.RoleEnum;
import com.example.petnestspring.dto.UserDTO;
import com.example.petnestspring.email.EmailSender;
import com.example.petnestspring.email.EmailValidator;
import com.example.petnestspring.repository.UserRepository;
import com.example.petnestspring.service.AuthorityService;
import com.example.petnestspring.service.PetService;
import com.example.petnestspring.service.UserService;
import com.example.petnestspring.service.implementation.UserServiceImpl;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import javax.imageio.ImageIO;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.time.LocalDateTime;
import java.util.*;
import java.util.List;


@Service
@RequiredArgsConstructor
public class AuthenticationService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final AuthorityService authorityService;
    private final PetService petService;
    private final EmailValidator emailValidator;
    private final ConfirmationTokenService confirmationTokenService;
    private final EmailSender emailSender;

    private final UserServiceImpl userServiceImpl;





    public AuthenticationResponse register(RegisterRequest registerRequest) {
        if (!userRepository.findByEmail(registerRequest.getEmail()).isEmpty()) {
            throw new RuntimeException("Email already exists");
        }

        var role = RoleEnum.User;
        var user = User.builder()
                .firstName(registerRequest.getFirstName())
                .lastName(registerRequest.getLastName())
                .email(registerRequest.getEmail())
                .phoneNumber(registerRequest.getPhoneNumber())
                .address(registerRequest.getAddress())
                .roleEnum(role)
                .city(registerRequest.getCity())
                .country(registerRequest.getCountry())
                .password(passwordEncoder.encode(registerRequest.getPassword()))
                .build();

        userRepository.save(user);

        // Generate the confirmation token
        String token = UUID.randomUUID().toString();
        ConfirmationToken confirmationToken = new ConfirmationToken(
                token,
                LocalDateTime.now(),
                LocalDateTime.now().plusMinutes(15),
                user // Associated user
        );

        // Save the token
        confirmationTokenService.saveConfirmationToken(confirmationToken);

        // Create the confirmation link
        String link = "http://localhost:8080/api/v1/auth/confirm?token=" + token;

        // Send the confirmation email
        emailSender.send(user.getEmail(), buildEmail(user.getFirstName(), link));

        // Create a response with JWT token and user info
        var jwtToken = jwtService.generateToken(user);

        return AuthenticationResponse.builder()
                .accessToken(jwtToken)
                .userInfo(user) // Include user info in the response
                .build();
    }


    @org.springframework.transaction.annotation.Transactional

    public  String confirmToken(String token) {
        ConfirmationToken confirmationToken = confirmationTokenService
                .getToken(token)
                .orElseThrow(() ->
                        new IllegalStateException("token not found"));

        if (confirmationToken.getConfirmedAt() != null) {
            throw new IllegalStateException("email already confirmed");
        }

        LocalDateTime expiredAt = confirmationToken.getExpiresAt();

        if (expiredAt.isBefore(LocalDateTime.now())) {
            throw new IllegalStateException("token expired");
        }
//enable
        confirmationTokenService.setConfirmedAt(token);
        userServiceImpl
                .enableUser(
                confirmationToken.getUser().getEmail());
        return "confirmed";
    }

    private String buildEmail(String name, String link) {
        return "<div style=\"font-family:Helvetica,Arial,sans-serif;font-size:16px;margin:0;color:#0b0c0c\">\n" +
                "\n" +
                "<span style=\"display:none;font-size:1px;color:#fff;max-height:0\"></span>\n" +
                "\n" +
                "  <table role=\"presentation\" width=\"100%\" style=\"border-collapse:collapse;min-width:100%;width:100%!important\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\">\n" +
                "    <tbody><tr>\n" +
                "      <td width=\"100%\" height=\"53\" bgcolor=\"#0b0c0c\">\n" +
                "        \n" +
                "        <table role=\"presentation\" width=\"100%\" style=\"border-collapse:collapse;max-width:580px\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\" align=\"center\">\n" +
                "          <tbody><tr>\n" +
                "            <td width=\"70\" bgcolor=\"#0b0c0c\" valign=\"middle\">\n" +
                "                <table role=\"presentation\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\" style=\"border-collapse:collapse\">\n" +
                "                  <tbody><tr>\n" +
                "                    <td style=\"padding-left:10px\">\n" +
                "                  \n" +
                "                    </td>\n" +
                "                    <td style=\"font-size:28px;line-height:1.315789474;Margin-top:4px;padding-left:10px\">\n" +
                "                      <span style=\"font-family:Helvetica,Arial,sans-serif;font-weight:700;color:#ffffff;text-decoration:none;vertical-align:top;display:inline-block\">Confirm your email</span>\n" +
                "                    </td>\n" +
                "                  </tr>\n" +
                "                </tbody></table>\n" +
                "              </a>\n" +
                "            </td>\n" +
                "          </tr>\n" +
                "        </tbody></table>\n" +
                "        \n" +
                "      </td>\n" +
                "    </tr>\n" +
                "  </tbody></table>\n" +
                "  <table role=\"presentation\" class=\"m_-6186904992287805515content\" align=\"center\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\" style=\"border-collapse:collapse;max-width:580px;width:100%!important\" width=\"100%\">\n" +
                "    <tbody><tr>\n" +
                "      <td width=\"10\" height=\"10\" valign=\"middle\"></td>\n" +
                "      <td>\n" +
                "        \n" +
                "                <table role=\"presentation\" width=\"100%\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\" style=\"border-collapse:collapse\">\n" +
                "                  <tbody><tr>\n" +
                "                    <td bgcolor=\"#1D70B8\" width=\"100%\" height=\"10\"></td>\n" +
                "                  </tr>\n" +
                "                </tbody></table>\n" +
                "        \n" +
                "      </td>\n" +
                "      <td width=\"10\" valign=\"middle\" height=\"10\"></td>\n" +
                "    </tr>\n" +
                "  </tbody></table>\n" +
                "\n" +
                "\n" +
                "\n" +
                "  <table role=\"presentation\" class=\"m_-6186904992287805515content\" align=\"center\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\" style=\"border-collapse:collapse;max-width:580px;width:100%!important\" width=\"100%\">\n" +
                "    <tbody><tr>\n" +
                "      <td height=\"30\"><br></td>\n" +
                "    </tr>\n" +
                "    <tr>\n" +
                "      <td width=\"10\" valign=\"middle\"><br></td>\n" +
                "      <td style=\"font-family:Helvetica,Arial,sans-serif;font-size:19px;line-height:1.315789474;max-width:560px\">\n" +
                "        \n" +
                "            <p style=\"Margin:0 0 20px 0;font-size:19px;line-height:25px;color:#0b0c0c\">Hi " + name + ",</p><p style=\"Margin:0 0 20px 0;font-size:19px;line-height:25px;color:#0b0c0c\"> Thank you for registering. Please click on the below link to activate your account: </p><blockquote style=\"Margin:0 0 20px 0;border-left:10px solid #b1b4b6;padding:15px 0 0.1px 15px;font-size:19px;line-height:25px\"><p style=\"Margin:0 0 20px 0;font-size:19px;line-height:25px;color:#0b0c0c\"> <a href=\"" + link + "\">Activate Now</a> </p></blockquote>\n Link will expire in 15 minutes. <p>See you soon</p>" +
                "        \n" +
                "      </td>\n" +
                "      <td width=\"10\" valign=\"middle\"><br></td>\n" +
                "    </tr>\n" +
                "    <tr>\n" +
                "      <td height=\"30\"><br></td>\n" +
                "    </tr>\n" +
                "  </tbody></table><div class=\"yj6qo\"></div><div class=\"adL\">\n" +
                "\n" +
                "</div></div>";
    }

    public AuthenticationResponse authenticate(AuthenticateRequest request) {

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );
        var user = userRepository.findByEmailNativeQuery(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!user.isEnabled()) {
            throw new RuntimeException("Account is not enabled. Please confirm your email.");
        }
        var jwtToken = jwtService.generateToken(user);

        return AuthenticationResponse.builder()
                .accessToken(jwtToken)
                .userInfo(user)
                .build();
    }


    public User getUserById(Long id) {
        return userRepository.findById(id).orElseThrow(() ->
                new RuntimeException("User not found with ID: " + id));
    }

    public Boolean checkIfTokenIsValid(String token) {
        var email = jwtService.extractUsername(token);
        User user = userRepository.findByEmailNativeQuery(email).orElseThrow();
        return jwtService.isTokenValid(token, user);
    }

    public User getUserInformations(String token) {
        var email = jwtService.extractUsername(token);
        return userRepository.findByEmailNativeQuery(email).orElseThrow();
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User promoteUser(String email) {
        if (!authorityService.hasRole("Admin")) {
            throw new RuntimeException("You are not authorized to perform this action");
        }
        User user = userRepository.findByEmailNativeQuery(email).orElseThrow();
        user.setRoleEnum(RoleEnum.Admin);
        return userRepository.save(user);
    }

    public void addUser(UserDTO userDTO) throws IOException {
        // Validate email
        if (!userRepository.findByEmail(userDTO.getEmail()).isEmpty()) {
            throw new RuntimeException("Email already exists");
        }

        // Check if image is provided and decode it
        String imageBase64 = userDTO.getImage();
        if (imageBase64 == null || imageBase64.isEmpty()) {
            throw new RuntimeException("Image data is missing");
        }

        byte[] decodedImage;
        try {
            decodedImage = Base64.getDecoder().decode(imageBase64);
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Invalid Base64 image data");
        }

        // Resize the image
        String resizedImage = resizeImage(decodedImage, 500); // Resize to a max width/height of 500px

        // Create new User object
        User newUser = User.builder()
                .firstName(userDTO.getFirstName())
                .lastName(userDTO.getLastName())
                .email(userDTO.getEmail())
                .phoneNumber(userDTO.getPhoneNumber())
                .address(userDTO.getAddress())
                .city(userDTO.getCity())
                .country(userDTO.getCountry())
                .password(passwordEncoder.encode(userDTO.getPassword())) // Encrypt password
                .roleEnum(RoleEnum.User) // Default role
                .image(resizedImage) // Store resized Base64 image
                .build();

        // Save user to the database
        userRepository.save(newUser);
    }

    // Helper method to resize the image
    private String resizeImage(byte[] originalImageBytes, int maxSize) throws IOException {
        // Convert byte array to BufferedImage
        ByteArrayInputStream byteArrayInputStream = new ByteArrayInputStream(originalImageBytes);
        BufferedImage originalImage = ImageIO.read(byteArrayInputStream);

        // Calculate the scaling factor
        int width = originalImage.getWidth();
        int height = originalImage.getHeight();
        double scale = Math.min((double) maxSize / width, (double) maxSize / height);

        // Calculate the new dimensions
        int newWidth = (int) (width * scale);
        int newHeight = (int) (height * scale);

        // Resize the image
        Image scaledImage = originalImage.getScaledInstance(newWidth, newHeight, Image.SCALE_SMOOTH);

        // Convert the scaled image back to a BufferedImage
        BufferedImage resizedImage = new BufferedImage(newWidth, newHeight, BufferedImage.TYPE_INT_RGB);
        Graphics2D graphics = resizedImage.createGraphics();
        graphics.drawImage(scaledImage, 0, 0, null);
        graphics.dispose();

        // Convert the resized image back to a byte array
        ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
        ImageIO.write(resizedImage, "jpg", byteArrayOutputStream);
        byte[] resizedImageBytes = byteArrayOutputStream.toByteArray();

        // Return the resized image as a Base64 string
        return Base64.getEncoder().encodeToString(resizedImageBytes);
    }


    public void editUser(Long id, UserDTO userDTO) {
        User existingUser = userRepository.findById(id).orElseThrow(() ->
                new RuntimeException("User not found with ID: " + id));

        existingUser.setFirstName(userDTO.getFirstName());
        existingUser.setLastName(userDTO.getLastName());
        existingUser.setEmail(userDTO.getEmail());
        existingUser.setPhoneNumber(userDTO.getPhoneNumber());
        existingUser.setAddress(userDTO.getAddress());
        existingUser.setCity(userDTO.getCity());
        existingUser.setCountry(userDTO.getCountry());

        // Update password only if provided
        if (userDTO.getPassword() != null && !userDTO.getPassword().isEmpty()) {
            existingUser.setPassword(passwordEncoder.encode(userDTO.getPassword()));
        }

        // Update image if provided
        if (userDTO.getImage() != null && !userDTO.getImage().isEmpty()) {
            try {
                byte[] decodedImage = Base64.getDecoder().decode(userDTO.getImage());
                String resizedImage = resizeImage(decodedImage, 500); // Resize to a max width/height of 500px
                existingUser.setImage(resizedImage);
            } catch (IllegalArgumentException | IOException e) {
                throw new RuntimeException("Invalid image data: " + e.getMessage());
            }
        }

        userRepository.save(existingUser);
    }

    @Transactional
    public ResponseEntity<Object> deactivateUser(Long id) {
        try {
            // Find the user
            User user = userRepository.findById(id).orElseThrow(() ->
                    new RuntimeException("User not found with ID: " + id));

            // Mark all pets associated with the user as deactivated
            petService.desactivatePetsByOwnerId(id);

            // Mark the user as deactivated
            user.setDesactivated(true);
            userRepository.save(user);  // Save the updated user

            // Return success response as JSON
            return new ResponseEntity<>(Map.of(
                    "success", true,
                    "message", "User and their pets have been deactivated successfully."
            ), HttpStatus.OK);

        } catch (Exception e) {
            // Return error response as JSON
            return new ResponseEntity<>(Map.of(
                    "success", false,
                    "message", "Error deactivating user and their pets: " + e.getMessage()
            ), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}