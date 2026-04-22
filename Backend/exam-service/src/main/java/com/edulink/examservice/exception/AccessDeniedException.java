package com.edulink.examservice.exception;

/**
 * Exception thrown when a user tries to access an endpoint without proper authorization.
 * For example: Student trying to create exam, Teacher trying to access student grades.
 */
public class AccessDeniedException extends RuntimeException {
    
    private String userRole;
    private String endpoint;
    private String requiredRole;

    public AccessDeniedException(String message) {
        super(message);
    }

    public AccessDeniedException(String userRole, String endpoint, String requiredRole) {
        super("Access Denied: User with role '" + userRole + "' cannot access '" + endpoint + 
              "'. Required role: '" + requiredRole + "'");
        this.userRole = userRole;
        this.endpoint = endpoint;
        this.requiredRole = requiredRole;
    }

    public AccessDeniedException(String message, Throwable cause) {
        super(message, cause);
    }

    public String getUserRole() {
        return userRole;
    }

    public String getEndpoint() {
        return endpoint;
    }

    public String getRequiredRole() {
        return requiredRole;
    }
}

