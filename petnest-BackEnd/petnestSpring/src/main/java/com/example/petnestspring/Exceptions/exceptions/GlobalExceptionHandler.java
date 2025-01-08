package com.example.petnestspring.Exceptions.exceptions;

/*
@RestControllerAdvice
public class GlobalExceptionHandler {
    @Autowired
    private ErrorResponseFormat errorResponse;

    @Autowired
    private ErrorResponseSimpleFormat errorSimpleResponse;

    // Method to handle validation exceptions
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponseFormat> handleValidationException(
            MethodArgumentNotValidException exception, HttpServletRequest request) {

        Map<String, List<String>> errorDetails = exception.getBindingResult()
                .getFieldErrors()
                .stream()
                .collect(Collectors.groupingBy(
                        FieldError::getField,
                        Collectors.mapping(DefaultMessageSourceResolvable::getDefaultMessage, Collectors.toList())
                ));

        errorResponse.setTimestamp(LocalDateTime.now());
        errorResponse.setMessage("Validation Failed");
        errorResponse.setDetails(errorDetails);
        errorResponse.setPath(request.getRequestURI());

        return ResponseEntity.badRequest().body(errorResponse);
    }

    // Method to handle 'NoSuchElementException' exceptions
    @ExceptionHandler(NoSuchElementException.class)
    public ResponseEntity<ErrorResponseSimpleFormat> handleNoSuchElementException(
            NoSuchElementException exception, HttpServletRequest request) {

        errorSimpleResponse.setTimestamp(LocalDateTime.now());
        errorSimpleResponse.setMessage("Resource Not Found");
        errorSimpleResponse.setDetails(Collections.singletonList(exception.getMessage()));
        errorSimpleResponse.setPath(request.getRequestURI());

        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorSimpleResponse);
    }

    // Method to handle 'NoSuchFileException' exceptions
    @ExceptionHandler(NoSuchFileException.class)
    public ResponseEntity<ErrorResponseSimpleFormat> handleNoSuchFileException(
            NoSuchFileException exception, HttpServletRequest request) {

        errorSimpleResponse.setTimestamp(LocalDateTime.now());
        errorSimpleResponse.setMessage("File Not Found");
        errorSimpleResponse.setDetails(Collections.singletonList(exception.getMessage()));
        errorSimpleResponse.setPath(request.getRequestURI());

        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorSimpleResponse);
    }

    // Method to handle 'DataIntegrityViolationException' exceptions
    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<ErrorResponseSimpleFormat> handleDataIntegrityViolationException(
            DataIntegrityViolationException exception, HttpServletRequest request) {

        errorSimpleResponse.setTimestamp(LocalDateTime.now());
        errorSimpleResponse.setMessage("Data Integrity Violation");
        errorSimpleResponse.setDetails(Arrays.asList(exception.getMessage().split(";")));
        errorSimpleResponse.setPath(request.getRequestURI());

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorSimpleResponse);
    }

    // Method to handle 'IllegalArgumentException' exceptions
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ErrorResponseSimpleFormat> handleIllegalArgumentException(
            IllegalArgumentException exception, HttpServletRequest request) {

        errorSimpleResponse.setTimestamp(LocalDateTime.now());
        errorSimpleResponse.setMessage("Illegal Argument Exception");
        errorSimpleResponse.setDetails(Arrays.asList(exception.getMessage().split(";")));
        errorSimpleResponse.setPath(request.getRequestURI());

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorSimpleResponse);
    }
}*/