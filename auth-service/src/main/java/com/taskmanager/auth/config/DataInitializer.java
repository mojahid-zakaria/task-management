package com.taskmanager.auth.config;

import com.taskmanager.auth.model.User;
import com.taskmanager.auth.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        // Create default users if they don't exist
        if (!userRepository.existsByEmail("admin@test.com")) {
            User admin = new User();
            admin.setName("Admin User");
            admin.setEmail("admin@test.com");
            admin.setPassword(passwordEncoder.encode("admin123"));
            userRepository.save(admin);
            System.out.println("Created default admin user: admin@test.com / admin123");
        }
        
        if (!userRepository.existsByEmail("user@test.com")) {
            User user = new User();
            user.setName("Test User");
            user.setEmail("user@test.com");
            user.setPassword(passwordEncoder.encode("user123"));
            userRepository.save(user);
            System.out.println("Created default test user: user@test.com / user123");
        }
    }
}
