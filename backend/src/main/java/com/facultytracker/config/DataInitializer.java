package com.facultytracker.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.facultytracker.entity.AvailabilityStatus;
import com.facultytracker.entity.Department;
import com.facultytracker.entity.Faculty;
import com.facultytracker.entity.FacultyAvailability;
import com.facultytracker.entity.FacultyLocation;
import com.facultytracker.entity.Lab;
import com.facultytracker.entity.LabOccupancyStatus;
import com.facultytracker.entity.LabStatus;
import com.facultytracker.entity.Role;
import com.facultytracker.entity.User;
import com.facultytracker.repository.DepartmentRepository;
import com.facultytracker.repository.FacultyAvailabilityRepository;
import com.facultytracker.repository.FacultyRepository;
import com.facultytracker.repository.LabRepository;
import com.facultytracker.repository.LabStatusRepository;
import com.facultytracker.repository.UserRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Initialize default data (admin user, departments, faculty, labs) on application startup.
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final DepartmentRepository departmentRepository;
    private final FacultyRepository facultyRepository;
    private final FacultyAvailabilityRepository facultyAvailabilityRepository;
    private final LabRepository labRepository;
    private final LabStatusRepository labStatusRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        if (userRepository.count() == 0) {
            initializeAllData();
        } else {
            log.info("Data already initialized, skipping seed data creation");
        }
    }

    private void initializeAllData() {
        log.info("Starting comprehensive data initialization...");
        
        // Create 4 departments
        Department csDept = createDepartment("Computer Science & Engineering");
        Department eceDept = createDepartment("Electronics & Communication");
        Department meDept = createDepartment("Mechanical Engineering");
        Department ceDept = createDepartment("Civil Engineering");
        
        // Create admin user
        User admin = createUser("System Administrator", "admin@facultytracker.com", "Admin123!", Role.ADMIN);
        
        // Create 15 faculty members with varied availability
        Faculty[] faculties = new Faculty[15];
        
        // CSE Faculty
        Faculty f1 = createFacultyWithAvailability("Dr. Anitha Raman", "anitha.raman@college.edu", csDept, "CSE-201", "9840011122", null, AvailabilityStatus.AVAILABLE, FacultyLocation.CABIN);
        Faculty f2 = createFacultyWithAvailability("Prof. Suresh Kumar", "suresh.kumar@college.edu", csDept, "CSE-204", "9840033344", null, AvailabilityStatus.IN_CLASS, FacultyLocation.CLASSROOM);
        Faculty f4 = createFacultyWithAvailability("Dr. Rajesh Iyer", "rajesh.iyer@college.edu", csDept, "CSE-207", "9840077788", null, AvailabilityStatus.AVAILABLE, FacultyLocation.CABIN);
        Faculty f10 = createFacultyWithAvailability("Dr. Karthik Reddy", "karthik.reddy@college.edu", csDept, "CSE-210", "9840191011", null, AvailabilityStatus.IN_CLASS, FacultyLocation.CLASSROOM);
        Faculty f14 = createFacultyWithAvailability("Dr. Naveen Joseph", "naveen.joseph@college.edu", csDept, "CSE-215", "9840279900", null, AvailabilityStatus.IN_MEETING, FacultyLocation.MEETING_HALL);
        
        // ECE Faculty
        Faculty f3 = createFacultyWithAvailability("Dr. Priya Menon", "priya.menon@college.edu", eceDept, "ECE-110", "9840055566", null, AvailabilityStatus.BUSY, FacultyLocation.CABIN);
        Faculty f5 = createFacultyWithAvailability("Prof. Lakshmi Nair", "lakshmi.nair@college.edu", eceDept, "ECE-115", "9840099900", null, AvailabilityStatus.IN_MEETING, FacultyLocation.MEETING_HALL);
        Faculty f11 = createFacultyWithAvailability("Prof. Sangeetha Rao", "sangeetha.rao@college.edu", eceDept, "ECE-120", "9840213344", null, AvailabilityStatus.AVAILABLE, FacultyLocation.CABIN);
        Faculty f15 = createFacultyWithAvailability("Prof. Revathi Chandran", "revathi.chandran@college.edu", eceDept, "ECE-125", "9840291122", null, AvailabilityStatus.AVAILABLE, FacultyLocation.CABIN);
        
        // Mechanical Engineering Faculty
        Faculty f6 = createFacultyWithAvailability("Dr. Vikram Sharma", "vikram.sharma@college.edu", meDept, "MECH-301", "9840112233", null, AvailabilityStatus.AVAILABLE, FacultyLocation.LAB);
        Faculty f7 = createFacultyWithAvailability("Prof. Deepa Krishnan", "deepa.krishnan@college.edu", meDept, "MECH-305", "9840134455", null, AvailabilityStatus.BUSY, FacultyLocation.CABIN);
        Faculty f12 = createFacultyWithAvailability("Dr. Mohan Das", "mohan.das@college.edu", meDept, "MECH-310", "9840235566", null, AvailabilityStatus.BUSY, FacultyLocation.LAB);
        
        // Civil Engineering Faculty
        Faculty f8 = createFacultyWithAvailability("Dr. Arvind Pillai", "arvind.pillai@college.edu", ceDept, "CIVIL-401", "9840156677", null, AvailabilityStatus.ON_LEAVE, FacultyLocation.OUTSIDE_CAMPUS);
        Faculty f9 = createFacultyWithAvailability("Prof. Meena Subramanian", "meena.subramanian@college.edu", ceDept, "CIVIL-405", "9840178899", null, AvailabilityStatus.AVAILABLE, FacultyLocation.CABIN);
        Faculty f13 = createFacultyWithAvailability("Prof. Kavitha Balan", "kavitha.balan@college.edu", ceDept, "CIVIL-410", "9840257788", null, AvailabilityStatus.AVAILABLE, FacultyLocation.CABIN);
        
        // Create lab incharge users
        User labIncharge1User = createUser("Mr. Vikram Singh", "vikram@facultytracker.com", "LabIncharge123!", Role.LAB_INCHARGE);
        User labIncharge2User = createUser("Ms. Neha Sharma", "neha@facultytracker.com", "LabIncharge123!", Role.LAB_INCHARGE);
        
        // Create 15 labs with their statuses
        // CSE Labs (5)
        createLabWithStatus("Programming Lab 1", csDept, 60, labIncharge1User, LabOccupancyStatus.OCCUPIED, 45);
        createLabWithStatus("Programming Lab 2", csDept, 55, null, LabOccupancyStatus.FREE, 0);
        createLabWithStatus("Networks Lab", csDept, 40, labIncharge1User, LabOccupancyStatus.OCCUPIED, 30);
        createLabWithStatus("Database Systems Lab", csDept, 45, null, LabOccupancyStatus.FREE, 0);
        createLabWithStatus("AI & ML Lab", csDept, 35, labIncharge1User, LabOccupancyStatus.OCCUPIED, 20);
        
        // ECE Labs (4)
        createLabWithStatus("Microprocessor Lab", eceDept, 35, labIncharge2User, LabOccupancyStatus.MAINTENANCE, 0);
        createLabWithStatus("VLSI Design Lab", eceDept, 30, null, LabOccupancyStatus.FREE, 0);
        createLabWithStatus("Communication Systems Lab", eceDept, 32, labIncharge2User, LabOccupancyStatus.OCCUPIED, 15);
        createLabWithStatus("Embedded Systems Lab", eceDept, 28, null, LabOccupancyStatus.FREE, 0);
        
        // Mechanical Engineering Labs (4)
        createLabWithStatus("Thermodynamics Lab", meDept, 40, null, LabOccupancyStatus.OCCUPIED, 25);
        createLabWithStatus("Fluid Mechanics Lab", meDept, 38, null, LabOccupancyStatus.FREE, 0);
        createLabWithStatus("CAD/CAM Lab", meDept, 42, null, LabOccupancyStatus.MAINTENANCE, 0);
        createLabWithStatus("Manufacturing Lab", meDept, 36, null, LabOccupancyStatus.OCCUPIED, 18);
        
        // Civil Engineering Labs (2)
        createLabWithStatus("Surveying Lab", ceDept, 30, null, LabOccupancyStatus.FREE, 0);
        createLabWithStatus("Concrete Testing Lab", ceDept, 25, null, LabOccupancyStatus.OCCUPIED, 10);
        
        log.info("Data initialization completed successfully!");
        log.info("✓ Departments: 4 created");
        log.info("✓ Faculty: 15 created with varied availability statuses");
        log.info("✓ Users: 1 Admin + 2 Lab Incharges");
        log.info("✓ Labs: 15 created with different occupancy statuses");
        log.info("✓ Lab Statuses: 15 created with varied occupancy");
    }

    private Department createDepartment(String name) {
        Department dept = Department.builder()
                .departmentName(name)
                .build();
        Department saved = departmentRepository.save(dept);
        log.info("Created department: {}", name);
        return saved;
    }

    private User createUser(String name, String email, String password, Role role) {
        User user = User.builder()
                .name(name)
                .email(email)
                .password(passwordEncoder.encode(password))
                .role(role)
                .build();
        User saved = userRepository.save(user);
        log.info("Created user: {} ({})", email, role);
        return saved;
    }

    private Faculty createFaculty(String name, String email, Department dept, String cabin, String phone, User user) {
        Faculty faculty = Faculty.builder()
                .facultyName(name)
                .email(email)
                .department(dept)
                .cabinNumber(cabin)
                .phone(phone)
                .user(user)
                .build();
        Faculty saved = facultyRepository.save(faculty);
        log.info("Created faculty: {} in {}", name, dept.getDepartmentName());
        return saved;
    }

    private void createFacultyAvailability(Faculty faculty, AvailabilityStatus status, FacultyLocation location) {
        FacultyAvailability availability = FacultyAvailability.builder()
                .faculty(faculty)
                .status(status)
                .location(location)
                .build();
        facultyAvailabilityRepository.save(availability);
        log.info("Created availability for faculty: {} - {} at {}", 
                faculty.getFacultyName(), status, location);
    }

    private Lab createLab(String name, Department dept, Integer capacity, User labIncharge) {
        Lab lab = Lab.builder()
                .labName(name)
                .department(dept)
                .capacity(capacity)
                .labIncharge(labIncharge)
                .build();
        Lab saved = labRepository.save(lab);
        log.info("Created lab: {} (Capacity: {})", name, capacity);
        return saved;
    }

    private void createLabStatus(Lab lab, LabOccupancyStatus status, Integer occupiedCount) {
        LabStatus labStatus = LabStatus.builder()
                .lab(lab)
                .status(status)
                .occupiedCount(occupiedCount)
                .build();
        labStatusRepository.save(labStatus);
        log.info("Created lab status for: {} - {} (Occupied: {})", 
                lab.getLabName(), status, occupiedCount);
    }

    private Faculty createFacultyWithAvailability(String name, String email, Department dept, String cabin, String phone, User user, AvailabilityStatus status, FacultyLocation location) {
        Faculty faculty = createFaculty(name, email, dept, cabin, phone, user);
        createFacultyAvailability(faculty, status, location);
        return faculty;
    }

    private Lab createLabWithStatus(String name, Department dept, Integer capacity, User labIncharge, LabOccupancyStatus status, Integer occupiedCount) {
        Lab lab = createLab(name, dept, capacity, labIncharge);
        createLabStatus(lab, status, occupiedCount);
        return lab;
    }
}
