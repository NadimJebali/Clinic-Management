import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Starting seed...");

  // Hash the password
  const hashedPassword = await bcrypt.hash("123456", 10);

  // Clear existing data
  console.log("Clearing existing data...");
  await prisma.prescription.deleteMany();
  await prisma.medicalRecord.deleteMany();
  await prisma.appointment.deleteMany();
  await prisma.patient.deleteMany();
  await prisma.doctor.deleteMany();
  await prisma.receptionist.deleteMany();
  await prisma.user.deleteMany();
  await prisma.clinic.deleteMany();

  // Create Clinics
  console.log("Creating clinics...");
  const clinic1 = await prisma.clinic.create({
    data: {
      name: "MedFlow Central Clinic",
      address: "123 Medical Plaza, New York, NY 10001",
      phone: "+1-555-0100",
      email: "central@medflow.com",
      description:
        "Our flagship clinic offering comprehensive medical services including cardiology, pediatrics, and general medicine.",
    },
  });

  const clinic2 = await prisma.clinic.create({
    data: {
      name: "MedFlow West Side",
      address: "456 Healthcare Ave, Los Angeles, CA 90001",
      phone: "+1-555-0200",
      email: "westside@medflow.com",
      description:
        "Specialized clinic focusing on orthopedics, neurology, and sports medicine.",
    },
  });

  const clinic3 = await prisma.clinic.create({
    data: {
      name: "MedFlow Pediatric Center",
      address: "789 Children's Way, Chicago, IL 60601",
      phone: "+1-555-0300",
      email: "pediatrics@medflow.com",
      description:
        "Dedicated pediatric care center with child-friendly environment and experienced pediatricians.",
    },
  });

  // Create Admin
  console.log("Creating admin user...");
  const admin = await prisma.user.create({
    data: {
      email: "admin@medflow.com",
      name: "Admin User",
      password: hashedPassword,
      role: "ADMIN",
    },
  });

  // Create Receptionists
  console.log("Creating receptionists...");
  const receptionist1 = await prisma.user.create({
    data: {
      email: "receptionist1@medflow.com",
      name: "Sarah Johnson",
      password: hashedPassword,
      role: "RECEPTIONIST",
      receptionist: {
        create: {
          phone: "+1234567890",
          clinicId: clinic1.id,
        },
      },
    },
  });

  const receptionist2 = await prisma.user.create({
    data: {
      email: "receptionist2@medflow.com",
      name: "Emily Davis",
      password: hashedPassword,
      role: "RECEPTIONIST",
      receptionist: {
        create: {
          phone: "+1234567891",
          clinicId: clinic2.id,
        },
      },
    },
  });

  // Create Doctors
  console.log("Creating doctors...");
  const doctor1 = await prisma.user.create({
    data: {
      email: "dr.smith@medflow.com",
      name: "Dr. John Smith",
      password: hashedPassword,
      role: "DOCTOR",
      doctor: {
        create: {
          specialty: "Cardiology",
          licenseNumber: "MD12345",
          phone: "+1234567892",
          clinicId: clinic1.id,
        },
      },
    },
  });

  const doctor2 = await prisma.user.create({
    data: {
      email: "dr.williams@medflow.com",
      name: "Dr. Sarah Williams",
      password: hashedPassword,
      role: "DOCTOR",
      doctor: {
        create: {
          specialty: "Pediatrics",
          licenseNumber: "MD12346",
          phone: "+1234567893",
          clinicId: clinic3.id,
        },
      },
    },
  });

  const doctor3 = await prisma.user.create({
    data: {
      email: "dr.brown@medflow.com",
      name: "Dr. Michael Brown",
      password: hashedPassword,
      role: "DOCTOR",
      doctor: {
        create: {
          specialty: "Orthopedics",
          licenseNumber: "MD12347",
          phone: "+1234567894",
          clinicId: clinic2.id,
        },
      },
    },
  });

  const doctor4 = await prisma.user.create({
    data: {
      email: "dr.garcia@medflow.com",
      name: "Dr. Maria Garcia",
      password: hashedPassword,
      role: "DOCTOR",
      doctor: {
        create: {
          specialty: "Dermatology",
          licenseNumber: "MD12348",
          phone: "+1234567895",
          clinicId: clinic1.id,
        },
      },
    },
  });

  const doctor5 = await prisma.user.create({
    data: {
      email: "dr.lee@medflow.com",
      name: "Dr. David Lee",
      password: hashedPassword,
      role: "DOCTOR",
      doctor: {
        create: {
          specialty: "Neurology",
          licenseNumber: "MD12349",
          phone: "+1234567896",
          clinicId: clinic2.id,
        },
      },
    },
  });

  // Get doctor records
  const doctors = await prisma.doctor.findMany();

  // Create Patients
  console.log("Creating patients...");
  const patient1 = await prisma.user.create({
    data: {
      email: "patient1@example.com",
      name: "Robert Anderson",
      password: hashedPassword,
      role: "PATIENT",
      patient: {
        create: {
          dateOfBirth: new Date("1985-03-15"),
          gender: "Male",
          phone: "+1234567897",
          address: "123 Main St, New York, NY 10001",
          bloodType: "O+",
          clinicId: clinic1.id,
        },
      },
    },
  });

  const patient2 = await prisma.user.create({
    data: {
      email: "patient2@example.com",
      name: "Jennifer Martinez",
      password: hashedPassword,
      role: "PATIENT",
      patient: {
        create: {
          dateOfBirth: new Date("1990-07-22"),
          gender: "Female",
          phone: "+1234567899",
          address: "456 Oak Ave, Los Angeles, CA 90001",
          bloodType: "A+",
          clinicId: clinic3.id,
        },
      },
    },
  });

  const patient3 = await prisma.user.create({
    data: {
      email: "patient3@example.com",
      name: "Christopher Taylor",
      password: hashedPassword,
      role: "PATIENT",
      patient: {
        create: {
          dateOfBirth: new Date("1978-11-30"),
          gender: "Male",
          phone: "+1234567901",
          address: "789 Pine Rd, Chicago, IL 60601",
          bloodType: "B+",
          clinicId: clinic2.id,
        },
      },
    },
  });

  const patient4 = await prisma.user.create({
    data: {
      email: "patient4@example.com",
      name: "Amanda Wilson",
      password: hashedPassword,
      role: "PATIENT",
      patient: {
        create: {
          dateOfBirth: new Date("1995-05-10"),
          gender: "Female",
          phone: "+1234567903",
          address: "321 Elm St, Houston, TX 77001",
          bloodType: "AB+",
          clinicId: clinic1.id,
        },
      },
    },
  });

  const patient5 = await prisma.user.create({
    data: {
      email: "patient5@example.com",
      name: "Daniel Thompson",
      password: hashedPassword,
      role: "PATIENT",
      patient: {
        create: {
          dateOfBirth: new Date("1982-09-18"),
          gender: "Male",
          phone: "+1234567905",
          address: "654 Maple Dr, Phoenix, AZ 85001",
          bloodType: "O-",
          clinicId: clinic2.id,
        },
      },
    },
  });

  const patient6 = await prisma.user.create({
    data: {
      email: "patient6@example.com",
      name: "Elizabeth Moore",
      password: hashedPassword,
      role: "PATIENT",
      patient: {
        create: {
          dateOfBirth: new Date("1988-12-05"),
          gender: "Female",
          phone: "+1234567907",
          address: "987 Cedar Ln, Philadelphia, PA 19101",
          bloodType: "A-",
          clinicId: clinic1.id,
        },
      },
    },
  });

  const patient7 = await prisma.user.create({
    data: {
      email: "patient7@example.com",
      name: "Matthew Jackson",
      password: hashedPassword,
      role: "PATIENT",
      patient: {
        create: {
          dateOfBirth: new Date("1975-04-28"),
          gender: "Male",
          phone: "+1234567909",
          address: "147 Birch St, San Antonio, TX 78201",
          bloodType: "B-",
          clinicId: clinic2.id,
        },
      },
    },
  });

  const patient8 = await prisma.user.create({
    data: {
      email: "patient8@example.com",
      name: "Jessica White",
      password: hashedPassword,
      role: "PATIENT",
      patient: {
        create: {
          dateOfBirth: new Date("1992-08-14"),
          gender: "Female",
          phone: "+1234567911",
          address: "258 Willow Way, San Diego, CA 92101",
          bloodType: "O+",
          clinicId: clinic3.id,
        },
      },
    },
  });

  // Get patient records
  const patients = await prisma.patient.findMany();

  // Create Appointments
  console.log("Creating appointments...");
  await prisma.appointment.create({
    data: {
      patientId: patients[0].id,
      doctorId: doctors[0].id,
      dateTime: new Date("2025-11-01T09:00:00"),
      duration: 30,
      status: "SCHEDULED",
      reason: "Annual checkup and blood pressure monitoring",
      notes: "Patient has history of hypertension",
    },
  });

  await prisma.appointment.create({
    data: {
      patientId: patients[1].id,
      doctorId: doctors[1].id,
      dateTime: new Date("2025-11-01T10:00:00"),
      duration: 45,
      status: "CONFIRMED",
      reason: "Child vaccination - MMR booster",
      notes: "Bring vaccination records",
    },
  });

  await prisma.appointment.create({
    data: {
      patientId: patients[2].id,
      doctorId: doctors[2].id,
      dateTime: new Date("2025-10-25T14:00:00"),
      duration: 60,
      status: "COMPLETED",
      reason: "Knee pain evaluation",
      notes: "MRI results reviewed",
    },
  });

  await prisma.appointment.create({
    data: {
      patientId: patients[3].id,
      doctorId: doctors[3].id,
      dateTime: new Date("2025-11-02T11:00:00"),
      duration: 30,
      status: "SCHEDULED",
      reason: "Skin rash examination",
      notes: "Patient reports itching for 2 weeks",
    },
  });

  await prisma.appointment.create({
    data: {
      patientId: patients[4].id,
      doctorId: doctors[4].id,
      dateTime: new Date("2025-11-03T15:00:00"),
      duration: 45,
      status: "SCHEDULED",
      reason: "Migraine consultation",
      notes: "Frequent headaches reported",
    },
  });

  await prisma.appointment.create({
    data: {
      patientId: patients[5].id,
      doctorId: doctors[0].id,
      dateTime: new Date("2025-10-20T10:30:00"),
      duration: 30,
      status: "COMPLETED",
      reason: "Follow-up cardiac evaluation",
      notes: "EKG performed",
    },
  });

  await prisma.appointment.create({
    data: {
      patientId: patients[6].id,
      doctorId: doctors[1].id,
      dateTime: new Date("2025-11-04T09:30:00"),
      duration: 30,
      status: "CONFIRMED",
      reason: "Flu symptoms consultation",
      notes: "Fever and cough for 3 days",
    },
  });

  await prisma.appointment.create({
    data: {
      patientId: patients[7].id,
      doctorId: doctors[3].id,
      dateTime: new Date("2025-10-15T13:00:00"),
      duration: 30,
      status: "COMPLETED",
      reason: "Acne treatment follow-up",
      notes: "Treatment showing improvement",
    },
  });

  // Create Medical Records
  console.log("Creating medical records...");
  await prisma.medicalRecord.create({
    data: {
      patientId: patients[0].id,
      doctorId: doctors[0].id,
      diagnosis: "Hypertension (Stage 1)",
      treatment: "Lifestyle modifications and medication",
      notes:
        "Blood pressure: 145/92. Prescribed Lisinopril 10mg daily. Advised low sodium diet and regular exercise. Follow-up in 3 months.",
    },
  });

  await prisma.medicalRecord.create({
    data: {
      patientId: patients[2].id,
      doctorId: doctors[2].id,
      diagnosis: "Osteoarthritis of the knee",
      treatment: "Physical therapy and pain management",
      notes:
        "MRI shows moderate cartilage degeneration. Prescribed NSAIDs for pain. Referred to physical therapy 3x per week for 6 weeks.",
    },
  });

  await prisma.medicalRecord.create({
    data: {
      patientId: patients[5].id,
      doctorId: doctors[0].id,
      diagnosis: "Atrial fibrillation",
      treatment: "Anticoagulation therapy",
      notes:
        "EKG confirms AFib. Started on Warfarin 5mg daily. INR monitoring required. Patient educated on stroke risk and medication compliance.",
    },
  });

  await prisma.medicalRecord.create({
    data: {
      patientId: patients[7].id,
      doctorId: doctors[3].id,
      diagnosis: "Moderate acne vulgaris",
      treatment: "Topical retinoids and antibiotics",
      notes:
        "Prescribed Tretinoin 0.025% cream and Doxycycline 100mg twice daily. Advised sun protection and gentle cleansing routine.",
    },
  });

  await prisma.medicalRecord.create({
    data: {
      patientId: patients[1].id,
      doctorId: doctors[1].id,
      diagnosis: "Upper respiratory tract infection",
      treatment: "Symptomatic treatment",
      notes:
        "Viral infection suspected. Prescribed supportive care with rest, fluids, and acetaminophen for fever. No antibiotics needed.",
    },
  });

  // Create Prescriptions
  console.log("Creating prescriptions...");
  await prisma.prescription.create({
    data: {
      patientId: patients[0].id,
      doctorId: doctors[0].id,
      medication: "Lisinopril",
      dosage: "10mg",
      frequency: "Once daily",
      duration: "90 days",
      instructions:
        "Take one tablet every morning with or without food. Monitor blood pressure regularly.",
    },
  });

  await prisma.prescription.create({
    data: {
      patientId: patients[2].id,
      doctorId: doctors[2].id,
      medication: "Ibuprofen",
      dosage: "400mg",
      frequency: "Three times daily",
      duration: "30 days",
      instructions:
        "Take with food to prevent stomach upset. Do not exceed 1200mg in 24 hours.",
    },
  });

  await prisma.prescription.create({
    data: {
      patientId: patients[5].id,
      doctorId: doctors[0].id,
      medication: "Warfarin",
      dosage: "5mg",
      frequency: "Once daily",
      duration: "Ongoing",
      instructions:
        "Take at the same time each evening. Regular INR monitoring required. Avoid vitamin K-rich foods.",
    },
  });

  await prisma.prescription.create({
    data: {
      patientId: patients[7].id,
      doctorId: doctors[3].id,
      medication: "Tretinoin Cream",
      dosage: "0.025%",
      frequency: "Once daily at bedtime",
      duration: "60 days",
      instructions:
        "Apply thin layer to affected areas. Use sunscreen during the day. May cause initial dryness.",
    },
  });

  await prisma.prescription.create({
    data: {
      patientId: patients[7].id,
      doctorId: doctors[3].id,
      medication: "Doxycycline",
      dosage: "100mg",
      frequency: "Twice daily",
      duration: "30 days",
      instructions:
        "Take with full glass of water. Avoid dairy products 2 hours before/after dose. Use sunscreen.",
    },
  });

  await prisma.prescription.create({
    data: {
      patientId: patients[4].id,
      doctorId: doctors[4].id,
      medication: "Sumatriptan",
      dosage: "50mg",
      frequency: "As needed",
      duration: "90 days (9 tablets)",
      instructions:
        "Take at first sign of migraine. May repeat once after 2 hours if needed. Maximum 200mg per day.",
    },
  });

  await prisma.prescription.create({
    data: {
      patientId: patients[1].id,
      doctorId: doctors[1].id,
      medication: "Acetaminophen",
      dosage: "500mg",
      frequency: "Every 6 hours as needed",
      duration: "7 days",
      instructions:
        "For fever and pain relief. Do not exceed 3000mg in 24 hours. Take with food or milk.",
    },
  });

  await prisma.prescription.create({
    data: {
      patientId: patients[3].id,
      doctorId: doctors[3].id,
      medication: "Hydrocortisone Cream",
      dosage: "1%",
      frequency: "Twice daily",
      duration: "14 days",
      instructions:
        "Apply thin layer to affected areas. Do not use on face unless directed. Wash hands after application.",
    },
  });

  console.log("Seed completed successfully!");
  console.log("\n=== Login Credentials ===");
  console.log("All users have password: 123456\n");
  console.log("Admin:");
  console.log("  Email: admin@medflow.com");
  console.log("\n=== Clinics ===");
  console.log("1. MedFlow Central Clinic (New York)");
  console.log("2. MedFlow West Side (Los Angeles)");
  console.log("3. MedFlow Pediatric Center (Chicago)");
  console.log("\nReceptionists:");
  console.log(
    "  Email: receptionist1@medflow.com (Sarah Johnson - Central Clinic)"
  );
  console.log("  Email: receptionist2@medflow.com (Emily Davis - West Side)");
  console.log("\nDoctors:");
  console.log(
    "  Email: dr.smith@medflow.com (Dr. John Smith - Cardiology - Central Clinic)"
  );
  console.log(
    "  Email: dr.williams@medflow.com (Dr. Sarah Williams - Pediatrics - Pediatric Center)"
  );
  console.log(
    "  Email: dr.brown@medflow.com (Dr. Michael Brown - Orthopedics - West Side)"
  );
  console.log(
    "  Email: dr.garcia@medflow.com (Dr. Maria Garcia - Dermatology - Central Clinic)"
  );
  console.log(
    "  Email: dr.lee@medflow.com (Dr. David Lee - Neurology - West Side)"
  );
  console.log("\nPatients:");
  console.log(
    "  Email: patient1@example.com (Robert Anderson - Central Clinic)"
  );
  console.log(
    "  Email: patient2@example.com (Jennifer Martinez - Pediatric Center)"
  );
  console.log("  Email: patient3@example.com (Christopher Taylor - West Side)");
  console.log("  Email: patient4@example.com (Amanda Wilson - Central Clinic)");
  console.log("  Email: patient5@example.com (Daniel Thompson - West Side)");
  console.log(
    "  Email: patient6@example.com (Elizabeth Moore - Central Clinic)"
  );
  console.log("  Email: patient7@example.com (Matthew Jackson - West Side)");
  console.log(
    "  Email: patient8@example.com (Jessica White - Pediatric Center)"
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
