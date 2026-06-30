-- ============================================================================
-- Smart Faculty & Lab Availability Tracking System
-- MySQL Database Schema
-- ============================================================================
-- Run with:  mysql -u root -p < schema.sql
-- ============================================================================

DROP DATABASE IF EXISTS faculty_tracker;
CREATE DATABASE faculty_tracker CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE faculty_tracker;

-- ----------------------------------------------------------------------------
-- Table: departments
-- ----------------------------------------------------------------------------
CREATE TABLE departments (
    department_id   BIGINT AUTO_INCREMENT PRIMARY KEY,
    department_name VARCHAR(150) NOT NULL UNIQUE
);

-- ----------------------------------------------------------------------------
-- Table: users
-- Holds login credentials for every actor (Admin, Faculty, Lab Incharge,
-- Student). Faculty and Lab Incharge rows are linked from `faculty` / `labs`.
-- ----------------------------------------------------------------------------
CREATE TABLE users (
    user_id    BIGINT AUTO_INCREMENT PRIMARY KEY,
    name       VARCHAR(150) NOT NULL,
    email      VARCHAR(150) NOT NULL UNIQUE,
    password   VARCHAR(255) NOT NULL,
    role       ENUM('ADMIN', 'FACULTY', 'LAB_INCHARGE', 'STUDENT') NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ----------------------------------------------------------------------------
-- Table: faculty
-- user_id is nullable+unique: a faculty profile can exist before a login is
-- provisioned, but at most one login maps to one faculty profile.
-- ----------------------------------------------------------------------------
CREATE TABLE faculty (
    faculty_id    BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id       BIGINT UNIQUE,
    faculty_name  VARCHAR(150) NOT NULL,
    email         VARCHAR(150) NOT NULL UNIQUE,
    department_id BIGINT,
    cabin_number  VARCHAR(50),
    phone         VARCHAR(20),
    CONSTRAINT fk_faculty_user FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE SET NULL,
    CONSTRAINT fk_faculty_department FOREIGN KEY (department_id) REFERENCES departments(department_id) ON DELETE SET NULL
);

CREATE INDEX idx_faculty_name ON faculty(faculty_name);

-- ----------------------------------------------------------------------------
-- Table: faculty_availability
-- One current-status row per faculty member (history is not retained here;
-- add an audit table later if a status timeline is needed).
-- ----------------------------------------------------------------------------
CREATE TABLE faculty_availability (
    availability_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    faculty_id       BIGINT NOT NULL UNIQUE,
    status            ENUM('AVAILABLE', 'BUSY', 'IN_CLASS', 'IN_MEETING', 'ON_LEAVE') NOT NULL DEFAULT 'AVAILABLE',
    location          ENUM('CABIN', 'LAB', 'CLASSROOM', 'MEETING_HALL', 'OUTSIDE_CAMPUS') NOT NULL DEFAULT 'CABIN',
    updated_time      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_availability_faculty FOREIGN KEY (faculty_id) REFERENCES faculty(faculty_id) ON DELETE CASCADE
);

-- ----------------------------------------------------------------------------
-- Table: labs
-- lab_incharge_user_id links a LAB_INCHARGE login to the lab they manage.
-- ----------------------------------------------------------------------------
CREATE TABLE labs (
    lab_id               BIGINT AUTO_INCREMENT PRIMARY KEY,
    lab_name             VARCHAR(150) NOT NULL,
    department_id        BIGINT,
    capacity             INT NOT NULL DEFAULT 0,
    lab_incharge_user_id BIGINT,
    CONSTRAINT fk_lab_department FOREIGN KEY (department_id) REFERENCES departments(department_id) ON DELETE SET NULL,
    CONSTRAINT fk_lab_incharge FOREIGN KEY (lab_incharge_user_id) REFERENCES users(user_id) ON DELETE SET NULL
);

CREATE INDEX idx_lab_name ON labs(lab_name);

-- ----------------------------------------------------------------------------
-- Table: lab_status
-- One current-status row per lab.
-- ----------------------------------------------------------------------------
CREATE TABLE lab_status (
    status_id      BIGINT AUTO_INCREMENT PRIMARY KEY,
    lab_id          BIGINT NOT NULL UNIQUE,
    status           ENUM('FREE', 'OCCUPIED', 'MAINTENANCE') NOT NULL DEFAULT 'FREE',
    occupied_count   INT NOT NULL DEFAULT 0,
    updated_time     TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_labstatus_lab FOREIGN KEY (lab_id) REFERENCES labs(lab_id) ON DELETE CASCADE
);

-- ============================================================================
-- Seed data
-- Default password for every seeded login is:  Password123!
-- (BCrypt-hashed below — change these accounts before using in production)
-- ============================================================================

INSERT INTO departments (department_name) VALUES
    ('Computer Science & Engineering'),
    ('Electronics & Communication'),
    ('Mechanical Engineering'),
    ('Civil Engineering');

-- Admin
INSERT INTO users (name, email, password, role) VALUES
    ('System Admin', 'admin@college.edu', '$2a$10$vJgE1kIAam8RQQVpjNk/DeVpoyCZTzP1qThp7lPyZCY/vxilB09Hu', 'ADMIN');

-- Faculty logins
INSERT INTO users (name, email, password, role) VALUES
    ('Dr. Anitha Raman', 'anitha.raman@college.edu', '$2a$10$vJgE1kIAam8RQQVpjNk/DeVpoyCZTzP1qThp7lPyZCY/vxilB09Hu', 'FACULTY'),
    ('Prof. Suresh Kumar', 'suresh.kumar@college.edu', '$2a$10$vJgE1kIAam8RQQVpjNk/DeVpoyCZTzP1qThp7lPyZCY/vxilB09Hu', 'FACULTY'),
    ('Dr. Priya Menon', 'priya.menon@college.edu', '$2a$10$vJgE1kIAam8RQQVpjNk/DeVpoyCZTzP1qThp7lPyZCY/vxilB09Hu', 'FACULTY');

-- Lab incharge login
INSERT INTO users (name, email, password, role) VALUES
    ('Mr. Karthik Babu', 'karthik.babu@college.edu', '$2a$10$vJgE1kIAam8RQQVpjNk/DeVpoyCZTzP1qThp7lPyZCY/vxilB09Hu', 'LAB_INCHARGE');

-- Student login (for testing search/view features)
INSERT INTO users (name, email, password, role) VALUES
    ('Test Student', 'student@college.edu', '$2a$10$vJgE1kIAam8RQQVpjNk/DeVpoyCZTzP1qThp7lPyZCY/vxilB09Hu', 'STUDENT');

-- Faculty profiles (linked to the users above)
INSERT INTO faculty (user_id, faculty_name, email, department_id, cabin_number, phone) VALUES
    (2, 'Dr. Anitha Raman', 'anitha.raman@college.edu', 1, 'CSE-201', '9840011122'),
    (3, 'Prof. Suresh Kumar', 'suresh.kumar@college.edu', 1, 'CSE-204', '9840033344'),
    (4, 'Dr. Priya Menon', 'priya.menon@college.edu', 2, 'ECE-110', '9840055566');

-- Initial availability
INSERT INTO faculty_availability (faculty_id, status, location) VALUES
    (1, 'AVAILABLE', 'CABIN'),
    (2, 'IN_CLASS', 'CLASSROOM'),
    (3, 'BUSY', 'CABIN');

-- Labs
INSERT INTO labs (lab_name, department_id, capacity, lab_incharge_user_id) VALUES
    ('Programming Lab 1', 1, 60, 5),
    ('Networks Lab', 1, 40, NULL),
    ('Microprocessor Lab', 2, 35, NULL);

-- Initial lab status
INSERT INTO lab_status (lab_id, status, occupied_count) VALUES
    (1, 'OCCUPIED', 45),
    (2, 'FREE', 0),
    (3, 'MAINTENANCE', 0);
