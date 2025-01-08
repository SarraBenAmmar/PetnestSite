package com.example.petnestspring.Exceptions.response;

import lombok.Data;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Component
public class ErrorResponseSimpleFormat {
    private LocalDateTime timestamp;
    private  String message;
    private List<String> details;
    private  String path;
}
