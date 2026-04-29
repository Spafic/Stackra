-- ============================================================
--  Stackra – Freelancing Platform
--  Full Schema with USERS supertype generalization
-- ============================================================

-- Create database
IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = 'stackra')
    CREATE DATABASE stackra;
GO

USE stackra;
GO

-- ----------------------------------------------------------------
-- 1. USERS (supertype)
-- ----------------------------------------------------------------
CREATE TABLE USERS (
    User_ID    INT           NOT NULL IDENTITY(1,1),
    Username   VARCHAR(100)  NOT NULL,
    Password   VARCHAR(255)  NOT NULL,
    Email      VARCHAR(150)  NOT NULL,
    Time_Zone  VARCHAR(60),
    Role       VARCHAR(20)   NOT NULL,
    Created_At DATETIME      DEFAULT GETDATE(),
    CONSTRAINT pk_users      PRIMARY KEY (User_ID),
    CONSTRAINT uq_username   UNIQUE (Username),
    CONSTRAINT uq_email      UNIQUE (Email),
    CONSTRAINT chk_role      CHECK (Role IN ('admin', 'client', 'freelancer'))
);
GO

-- ----------------------------------------------------------------
-- 2. ADMIN (subtype)
-- ----------------------------------------------------------------
CREATE TABLE ADMIN (
    User_ID  INT NOT NULL,
    CONSTRAINT pk_admin      PRIMARY KEY (User_ID),
    CONSTRAINT fk_admin_user FOREIGN KEY (User_ID)
        REFERENCES USERS (User_ID) ON DELETE CASCADE
);
GO

-- ----------------------------------------------------------------
-- 3. CLIENT (subtype)
-- ----------------------------------------------------------------
CREATE TABLE CLIENT (
    User_ID      INT            NOT NULL,
    Avg_Spending DECIMAL(12, 2) DEFAULT 0,
    CONSTRAINT pk_client      PRIMARY KEY (User_ID),
    CONSTRAINT fk_client_user FOREIGN KEY (User_ID)
        REFERENCES USERS (User_ID) ON DELETE CASCADE
);
GO

-- CLIENT multi-valued: Fax Numbers
CREATE TABLE CLIENT_FAX (
    Client_ID  INT          NOT NULL,
    Fax_Number VARCHAR(30)  NOT NULL,
    CONSTRAINT pk_client_fax PRIMARY KEY (Client_ID, Fax_Number),
    CONSTRAINT fk_client_fax FOREIGN KEY (Client_ID)
        REFERENCES CLIENT (User_ID) ON DELETE CASCADE
);
GO

-- CLIENT multi-valued: Phone Numbers
CREATE TABLE CLIENT_PHONE (
    Client_ID    INT         NOT NULL,
    Phone_Number VARCHAR(30) NOT NULL,
    CONSTRAINT pk_client_phone PRIMARY KEY (Client_ID, Phone_Number),
    CONSTRAINT fk_client_phone FOREIGN KEY (Client_ID)
        REFERENCES CLIENT (User_ID) ON DELETE CASCADE
);
GO

-- ----------------------------------------------------------------
-- 4. FREELANCER (subtype)
-- ----------------------------------------------------------------
CREATE TABLE FREELANCER (
    User_ID   INT  NOT NULL,
    Portfolio TEXT,
    CONSTRAINT pk_freelancer      PRIMARY KEY (User_ID),
    CONSTRAINT fk_freelancer_user FOREIGN KEY (User_ID)
        REFERENCES USERS (User_ID) ON DELETE CASCADE
);
GO

-- FREELANCER weak entity: Experience
CREATE TABLE EXPERIENCE (
    Freelancer_ID INT          NOT NULL,
    Company       VARCHAR(150) NOT NULL,
    Start_Date    DATE         NOT NULL,
    End_Date      DATE,
    Position      VARCHAR(150),
    Description   TEXT,
    CONSTRAINT pk_experience      PRIMARY KEY (Freelancer_ID, Company, Start_Date),
    CONSTRAINT fk_exp_freelancer  FOREIGN KEY (Freelancer_ID)
        REFERENCES FREELANCER (User_ID) ON DELETE CASCADE
);
GO

-- FREELANCER weak entity: Socials
CREATE TABLE SOCIALS (
    Freelancer_ID INT          NOT NULL,
    URL           VARCHAR(500) NOT NULL,
    Type          VARCHAR(60),
    CONSTRAINT pk_socials            PRIMARY KEY (Freelancer_ID, URL),
    CONSTRAINT fk_socials_freelancer FOREIGN KEY (Freelancer_ID)
        REFERENCES FREELANCER (User_ID) ON DELETE CASCADE
);
GO
-- ----------------------------------------------------------------
-- 5. SKILLS
-- ----------------------------------------------------------------
CREATE TABLE SKILLS (
    Name        VARCHAR(100) NOT NULL,
    Category    VARCHAR(100),
    Description TEXT,
    Added_By    INT,
    CONSTRAINT pk_skills       PRIMARY KEY (Name),
    CONSTRAINT fk_skills_admin FOREIGN KEY (Added_By)
        REFERENCES ADMIN (User_ID) ON DELETE SET NULL
);
GO

-- M:N FREELANCER <-> SKILLS
CREATE TABLE FREELANCER_SKILLS (
    Freelancer_ID INT          NOT NULL,
    Skill_Name    VARCHAR(100) NOT NULL,
    CONSTRAINT pk_freelancer_skills PRIMARY KEY (Freelancer_ID, Skill_Name),
    CONSTRAINT fk_fs_freelancer     FOREIGN KEY (Freelancer_ID)
        REFERENCES FREELANCER (User_ID) ON DELETE CASCADE,
    CONSTRAINT fk_fs_skill          FOREIGN KEY (Skill_Name)
        REFERENCES SKILLS (Name) ON DELETE CASCADE
);
GO

-- ----------------------------------------------------------------
-- 6. POST
-- ----------------------------------------------------------------
CREATE TABLE POST (
    Post_ID              INT            NOT NULL IDENTITY(1,1),
    Job_Description      TEXT,
    Status               VARCHAR(50)    DEFAULT 'pending',
    Price_Min            DECIMAL(12, 2),
    Price_Max            DECIMAL(12, 2),
    Avail_Comm_Hours     VARCHAR(100),
    Expected_Deadline    DATE,
    Created_By_Client_ID INT            NOT NULL,
    Accepted_By_Admin_ID INT,
    Created_At           DATETIME       DEFAULT GETDATE(),
    CONSTRAINT pk_post        PRIMARY KEY (Post_ID),
    CONSTRAINT chk_post_status CHECK (Status IN ('pending', 'active', 'closed', 'rejected')),
    CONSTRAINT fk_post_client FOREIGN KEY (Created_By_Client_ID)
        REFERENCES CLIENT (User_ID),
    CONSTRAINT fk_post_admin  FOREIGN KEY (Accepted_By_Admin_ID)
        REFERENCES ADMIN (User_ID) ON DELETE SET NULL
);
GO

-- ----------------------------------------------------------------
-- 7. PROPOSAL
-- ----------------------------------------------------------------
CREATE TABLE PROPOSAL (
    Proposal_ID      INT            NOT NULL IDENTITY(1,1),
    Proposal_Message TEXT,
    Status           VARCHAR(50)    DEFAULT 'pending',
    Price            DECIMAL(12, 2),
    Exp_Job_Duration VARCHAR(100),
    Avail_Comm_Hours VARCHAR(100),
    Post_ID          INT            NOT NULL,
    Freelancer_ID    INT            NOT NULL,
    Created_At       DATETIME       DEFAULT GETDATE(),
    CONSTRAINT pk_proposal          PRIMARY KEY (Proposal_ID),
    CONSTRAINT chk_proposal_status  CHECK (Status IN ('pending', 'accepted', 'rejected')),
    CONSTRAINT fk_proposal_post     FOREIGN KEY (Post_ID)
        REFERENCES POST (Post_ID) ON DELETE CASCADE,
    CONSTRAINT fk_proposal_freelancer FOREIGN KEY (Freelancer_ID)
        REFERENCES FREELANCER (User_ID)
);
GO

-- ----------------------------------------------------------------
-- 8. JOB
-- ----------------------------------------------------------------
CREATE TABLE JOB (
    Job_ID               INT            NOT NULL IDENTITY(1,1),
    Status               VARCHAR(50)    DEFAULT 'in_progress',
    Price                DECIMAL(12, 2),
    Project_Deadline     DATE,
    Accepted_Proposal_ID INT,
    Created_At           DATETIME       DEFAULT GETDATE(),
    CONSTRAINT pk_job        PRIMARY KEY (Job_ID),
    CONSTRAINT chk_job_status CHECK (Status IN ('in_progress', 'completed', 'cancelled', 'disputed')),
    CONSTRAINT fk_job_proposal FOREIGN KEY (Accepted_Proposal_ID)
        REFERENCES PROPOSAL (Proposal_ID) ON DELETE SET NULL
);
GO

-- ----------------------------------------------------------------
-- 9. DELIVERABLE (weak entity of JOB)
-- ----------------------------------------------------------------
CREATE TABLE DELIVERABLE (
    Job_ID      INT  NOT NULL,
    Number      INT  NOT NULL,
    Attachment  TEXT,
    Description TEXT,
    Deadline    DATE,
    CONSTRAINT pk_deliverable     PRIMARY KEY (Job_ID, Number),
    CONSTRAINT fk_deliverable_job FOREIGN KEY (Job_ID)
        REFERENCES JOB (Job_ID) ON DELETE CASCADE
);
GO

-- ----------------------------------------------------------------
-- 10. REVIEW
-- ----------------------------------------------------------------
CREATE TABLE REVIEW (
    Review_ID      INT            NOT NULL IDENTITY(1,1),
    FL_Rating      DECIMAL(3, 2),
    FL_Description TEXT,
    CL_Rating      DECIMAL(3, 2),
    CL_Description TEXT,
    Job_ID         INT            NOT NULL,
    Admin_ID       INT,
    CONSTRAINT pk_review       PRIMARY KEY (Review_ID),
    CONSTRAINT uq_review_job   UNIQUE (Job_ID),
    CONSTRAINT chk_fl_rating   CHECK (FL_Rating BETWEEN 0 AND 5),
    CONSTRAINT chk_cl_rating   CHECK (CL_Rating BETWEEN 0 AND 5),
    CONSTRAINT fk_review_job   FOREIGN KEY (Job_ID)
        REFERENCES JOB (Job_ID) ON DELETE CASCADE,
    CONSTRAINT fk_review_admin FOREIGN KEY (Admin_ID)
        REFERENCES ADMIN (User_ID) ON DELETE SET NULL
);
GO