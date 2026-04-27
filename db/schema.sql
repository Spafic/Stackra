-- ============================================================
--  Freelancing Platform – Database Schema (DDL)
--  Derived from DB_Project.drawio (ER Diagram)
-- ============================================================
-- ----------------------------------------------------------------
-- 1. ADMIN
-- ----------------------------------------------------------------
CREATE TABLE ADMIN (
    Admin_ID INT NOT NULL,
    Username VARCHAR(100) NOT NULL UNIQUE,
    Password VARCHAR(255) NOT NULL,
    Email VARCHAR(150) NOT NULL UNIQUE,
    Time_Zone VARCHAR(60),
    CONSTRAINT pk_admin PRIMARY KEY (Admin_ID)
);
-- ----------------------------------------------------------------
-- 2. CLIENT
-- ----------------------------------------------------------------
CREATE TABLE CLIENT (
    Client_ID INT NOT NULL,
    Username VARCHAR(100) NOT NULL UNIQUE,
    Password VARCHAR(255) NOT NULL,
    Email VARCHAR(150) NOT NULL UNIQUE,
    Time_Zone VARCHAR(60),
    Avg_Spending DECIMAL(12, 2),
    CONSTRAINT pk_client PRIMARY KEY (Client_ID)
);
-- CLIENT multi-valued attribute: Fax Numbers
CREATE TABLE CLIENT_FAX (
    Client_ID INT NOT NULL,
    Fax_Number VARCHAR(30) NOT NULL,
    CONSTRAINT pk_client_fax PRIMARY KEY (Client_ID, Fax_Number),
    CONSTRAINT fk_client_fax FOREIGN KEY (Client_ID) REFERENCES CLIENT (Client_ID) ON DELETE CASCADE
);
-- CLIENT multi-valued attribute: Phone Numbers
CREATE TABLE CLIENT_PHONE (
    Client_ID INT NOT NULL,
    Phone_Number VARCHAR(30) NOT NULL,
    CONSTRAINT pk_client_phone PRIMARY KEY (Client_ID, Phone_Number),
    CONSTRAINT fk_client_phone FOREIGN KEY (Client_ID) REFERENCES CLIENT (Client_ID) ON DELETE CASCADE
);
-- ----------------------------------------------------------------
-- 3. FREELANCER
-- ----------------------------------------------------------------
CREATE TABLE FREELANCER (
    Freelancer_ID INT NOT NULL,
    Username VARCHAR(100) NOT NULL UNIQUE,
    Password VARCHAR(255) NOT NULL,
    Email VARCHAR(150) NOT NULL UNIQUE,
    Time_Zone VARCHAR(60),
    Portfolio TEXT,
    CONSTRAINT pk_freelancer PRIMARY KEY (Freelancer_ID)
);
-- ----------------------------------------------------------------
-- 4. EXPERIENCE  (weak entity – identifying owner: FREELANCER)
--    Composite key: (Freelancer_ID, Company, Start_date)
-- ----------------------------------------------------------------
CREATE TABLE EXPERIENCE (
    Freelancer_ID INT NOT NULL,
    Company VARCHAR(150) NOT NULL,
    Start_date DATE NOT NULL,
    End_date DATE,
    Position VARCHAR(150),
    Description TEXT,
    CONSTRAINT pk_experience PRIMARY KEY (Freelancer_ID, Company, Start_date),
    CONSTRAINT fk_exp_freelancer FOREIGN KEY (Freelancer_ID) REFERENCES FREELANCER (Freelancer_ID) ON DELETE CASCADE
);
-- ----------------------------------------------------------------
-- 5. SOCIALS  (weak entity – identifying owner: FREELANCER)
--    Composite key: (Freelancer_ID, URL)
-- ----------------------------------------------------------------
CREATE TABLE SOCIALS (
    Freelancer_ID INT NOT NULL,
    URL VARCHAR(500) NOT NULL,
    Type VARCHAR(60),
    CONSTRAINT pk_socials PRIMARY KEY (Freelancer_ID, URL),
    CONSTRAINT fk_socials_freelancer FOREIGN KEY (Freelancer_ID) REFERENCES FREELANCER (Freelancer_ID) ON DELETE CASCADE
);
-- ----------------------------------------------------------------
-- 6. SKILLS
-- ----------------------------------------------------------------
CREATE TABLE SKILLS (
    Name VARCHAR(100) NOT NULL,
    Category VARCHAR(100),
    Description TEXT,
    Added_by INT,
    -- FK → ADMIN
    CONSTRAINT pk_skills PRIMARY KEY (Name),
    CONSTRAINT fk_skills_admin FOREIGN KEY (Added_by) REFERENCES ADMIN (Admin_ID) ON DELETE
    SET NULL
);
-- ----------------------------------------------------------------
-- 7. FREELANCER_SKILLS  (M:N between FREELANCER and SKILLS)
-- ----------------------------------------------------------------
CREATE TABLE FREELANCER_SKILLS (
    Freelancer_ID INT NOT NULL,
    Skill_Name VARCHAR(100) NOT NULL,
    CONSTRAINT pk_freelancer_skills PRIMARY KEY (Freelancer_ID, Skill_Name),
    CONSTRAINT fk_fs_freelancer FOREIGN KEY (Freelancer_ID) REFERENCES FREELANCER (Freelancer_ID) ON DELETE CASCADE,
    CONSTRAINT fk_fs_skill FOREIGN KEY (Skill_Name) REFERENCES SKILLS (Name) ON DELETE CASCADE
);
-- ----------------------------------------------------------------
-- 8. POST
-- ----------------------------------------------------------------
CREATE TABLE POST (
    Post_ID INT NOT NULL,
    Job_Description TEXT,
    Status VARCHAR(50),
    Price_Min DECIMAL(12, 2),
    Price_Max DECIMAL(12, 2),
    Avail_Comm_Hours VARCHAR(100),
    Expected_Deadline DATE,
    Created_by_Client_ID INT NOT NULL,
    -- FK → CLIENT
    Accepted_by_Admin_ID INT,
    -- FK → ADMIN
    CONSTRAINT pk_post PRIMARY KEY (Post_ID),
    CONSTRAINT fk_post_client FOREIGN KEY (Created_by_Client_ID) REFERENCES CLIENT (Client_ID) ON DELETE CASCADE,
    CONSTRAINT fk_post_admin FOREIGN KEY (Accepted_by_Admin_ID) REFERENCES ADMIN (Admin_ID) ON DELETE
    SET NULL
);
-- ----------------------------------------------------------------
-- 9. PROPOSAL
-- ----------------------------------------------------------------
CREATE TABLE PROPOSAL (
    Proposal_ID INT NOT NULL,
    Proposal_Message TEXT,
    Status VARCHAR(50),
    Price DECIMAL(12, 2),
    Exp_Job_Duration VARCHAR(100),
    Avail_Comm_Hours VARCHAR(100),
    Post_ID INT NOT NULL,
    -- FK → POST
    Freelancer_ID INT NOT NULL,
    -- FK → FREELANCER
    CONSTRAINT pk_proposal PRIMARY KEY (Proposal_ID),
    CONSTRAINT fk_proposal_post FOREIGN KEY (Post_ID) REFERENCES POST (Post_ID) ON DELETE CASCADE,
    CONSTRAINT fk_proposal_freelancer FOREIGN KEY (Freelancer_ID) REFERENCES FREELANCER (Freelancer_ID) ON DELETE CASCADE
);
-- ----------------------------------------------------------------
-- 10. JOB
-- ----------------------------------------------------------------
CREATE TABLE JOB (
    Job_ID INT NOT NULL,
    Status VARCHAR(50),
    Price DECIMAL(12, 2),
    Project_Deadline DATE,
    Accepted_Proposal_ID INT,
    -- FK → PROPOSAL
    CONSTRAINT pk_job PRIMARY KEY (Job_ID),
    CONSTRAINT fk_job_proposal FOREIGN KEY (Accepted_Proposal_ID) REFERENCES PROPOSAL (Proposal_ID) ON DELETE
    SET NULL
);
-- ----------------------------------------------------------------
-- 11. REVIEW
-- ----------------------------------------------------------------
CREATE TABLE REVIEW (
    Review_ID INT NOT NULL,
    FL_Rating DECIMAL(3, 2),
    -- e.g. 4.75
    FL_Description TEXT,
    CL_Rating DECIMAL(3, 2),
    CL_Description TEXT,
    Job_ID INT NOT NULL,
    -- FK → JOB
    Admin_ID INT,
    -- FK → ADMIN (moderates)
    CONSTRAINT pk_review PRIMARY KEY (Review_ID),
    CONSTRAINT fk_review_job FOREIGN KEY (Job_ID) REFERENCES JOB (Job_ID) ON DELETE CASCADE,
    CONSTRAINT fk_review_admin FOREIGN KEY (Admin_ID) REFERENCES ADMIN (Admin_ID) ON DELETE
    SET NULL
);
-- ----------------------------------------------------------------
-- 12. DELIVERABLE  (weak entity – identifying owner: JOB)
--     Composite key: (Job_ID, Number)
-- ----------------------------------------------------------------
CREATE TABLE DELIVERABLE (
    Job_ID INT NOT NULL,
    Number INT NOT NULL,
    -- partial key
    Attachment TEXT,
    -- path / URL
    Description TEXT,
    Deadline DATE,
    CONSTRAINT pk_deliverable PRIMARY KEY (Job_ID, Number),
    CONSTRAINT fk_deliverable_job FOREIGN KEY (Job_ID) REFERENCES JOB (Job_ID) ON DELETE CASCADE
);