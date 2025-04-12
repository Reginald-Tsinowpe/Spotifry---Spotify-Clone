-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Apr 11, 2025 at 04:20 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `db_spotifry_clone`
--

-- --------------------------------------------------------

--
-- Table structure for table `tbl_messages`
--

CREATE TABLE `tbl_messages` (
  `message_id` int(11) NOT NULL,
  `sender_id` varchar(100) DEFAULT NULL,
  `receiver_id` varchar(100) DEFAULT NULL,
  `message_text` text DEFAULT NULL,
  `timestamp` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tbl_messages`
--

INSERT INTO `tbl_messages` (`message_id`, `sender_id`, `receiver_id`, `message_text`, `timestamp`) VALUES
(2, 'Reginaldo', 'Hallelujah', 'hiii', '2025-04-10 23:35:55'),
(3, 'Reginaldo', 'Hallelujah', '', '2025-04-10 23:35:59'),
(4, 'Hallelujah', 'Reginaldo', 'hello', '2025-04-10 23:36:34'),
(5, 'Reginaldo', 'Hallelujah', 'how are you?', '2025-04-10 23:36:40'),
(6, 'Hallelujah', 'Reginaldo', 'I\'m good. you?', '2025-04-10 23:36:54'),
(7, 'Reginaldo', 'Hallelujah', 'another testtt', '2025-04-10 23:37:17'),
(8, 'Hallelujah', 'Reginaldo', 'hi again', '2025-04-10 23:45:19'),
(9, 'Reginaldo', 'Hallelujah', 'message to test scrolling capabilities', '2025-04-11 00:26:10');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_musics`
--

CREATE TABLE `tbl_musics` (
  `title` varchar(255) NOT NULL,
  `artists` varchar(255) NOT NULL,
  `tags` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`tags`)),
  `location` varchar(255) NOT NULL,
  `id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tbl_musics`
--

INSERT INTO `tbl_musics` (`title`, `artists`, `tags`, `location`, `id`) VALUES
('Rush', 'Ayra Starr', '[\"African\", \"Nigerian\", \"Afrobeats\"]', './music/Ayra_Starr_-_Rush(256k).mp3', 1),
('Brother Brother Official Video', 'Bisa kdei', '[\"African\", \"Afrobeats\"]', './music/Bisa_kdei_-_Brother_Brother_(Official_Video)(256k).mp3', 2),
('Mansa Official Video', 'BIsa Kdei', '[\"African\", \"Afrobeats\"]', './music/BIsa_Kdei_-_Mansa_(Official_Video)(256k).mp3', 3),
('Next Chapter Official Video', 'Bisa Kdei', '[\"African\", \"Afrobeats\"]', './music/Bisa_Kdei_-_Next_Chapter_(Official_Video)(256k).mp3', 4),
('Odo Carpenter Official Video', 'Bisa Kdei', '[\"African\", \"Afrobeats\"]', './music/Bisa_Kdei_-_Odo_Carpenter_(Official_Video)(256k).mp3', 5),
('Ankonam', 'Black Sherif', '[\"African\", \"Afrobeats\"]', './music/Black-Sherif-Ankonam.mp3', 6),
('Dont-Forget-Me', 'Black Sherif', '[\"African\", \"Afrobeats\"]', './music/Black-Sherif-Dont-Forget-Me.mp3', 7),
('KILOS-MILOS', 'Black Sherif', '[\"African\", \"Afrobeats\"]', './music/Black-Sherif-KILOS-MILOS.mp3', 8),
('Lord-Im-Amazed', 'Black Sherif', '[\"African\", \"Afrobeats\"]', './music/Black-Sherif-Lord-Im-Amazed.ghanasongs.com_.mp3', 9),
('Money', 'Black Sherif', '[\"African\", \"Afrobeats\"]', './music/Black-Sherif-Money.mp3', 10),
('OH-NO', 'Black Sherif', '[\"African\", \"Afrobeats\"]', './music/Black-Sherif-OH-NO.mp3', 11),
('Oh-Paradise', 'Black Sherif', '[\"African\", \"Afrobeats\"]', './music/Black-Sherif-Oh-Paradise.mp3', 12),
('Oil-In-My-Head', 'Black Sherif', '[\"African\", \"Afrobeats\"]', './music/Black-Sherif-Oil-In-My-Head.mp3', 13),
('Prey-De-Youngsta', 'Black Sherif', '[\"African\", \"Afrobeats\"]', './music/Black-Sherif-Prey-De-Youngsta.mp3', 14),
('Rebel-Music', 'Black Sherif', '[\"African\", \"Afrobeats\"]', './music/Black-Sherif-Rebel-Music.mp3', 15),
('Sad-Boys-Dont-Fold', 'Black Sherif', '[\"African\", \"Afrobeats\"]', './music/Black-Sherif-Sad-Boys-Dont-Fold.mp3', 16),
('Simmer-Down', 'Black Sherif', '[\"African\", \"Afrobeats\"]', './music/Black-Sherif-Simmer-Down.mp3', 17),
('Wasteman', 'Black Sherif', '[\"African\", \"Afrobeats\"]', './music/Black-Sherif-Wasteman.mp3', 18),
('We-Up', 'Black Sherif', '[\"African\", \"Afrobeats\"]', './music/Black-Sherif-We-Up.mp3', 19),
('Run', 'Black Sheriff ft Empire', '[\"African\", \"Afrobeats\"]', './music/Black_Sheriff_ft_Empire_-_Run__lyrics_video_(256k).mp3', 20),
('Destiny', 'Black Sherif', '[\"African\", \"Afrobeats\"]', './music/Black_Sherif_-_Destiny__Lyrics_Video_(256k).mp3', 21),
('First Sermon', 'Black Sherif', '[\"African\", \"Afrobeats\"]', './music/Black_Sherif_-_First_Sermon__Official_Video_(256k).mp3', 23),
('January 9th', 'Black Sherif', '[\"African\", \"Afrobeats\"]', './music/Black_Sherif_-_January_9th__Official_Video_(256k).mp3', 24),
('Kilos Milos', 'Black Sherif', '[\"African\", \"Afrobeats\"]', './music/Black_Sherif_-_Kilos_Milos__Official_Visualizer_(256k).mp3', 25),
('Konongo Zongo', 'Black Sherif', '[\"African\", \"Afrobeats\"]', './music/Black_Sherif_-_Konongo_Zongo__Official_Video_(256k).mp3', 27),
('Kwaku the Traveller', 'Black Sherif', '[\"African\", \"Afrobeats\"]', './music/Black_Sherif_-_Kwaku_the_Traveller_(Official_Video)(256k).mp3', 28),
('Money', 'Black Sherif', '[\"African\", \"Afrobeats\"]', './music/Black_Sherif_-_Money__Official_Video_(256k).mp3', 29),
('OH NO', 'Black Sherif', '[\"African\", \"Afrobeats\"]', './music/Black_Sherif_-_OH_NO__Official_Visualizer_(256k).mp3', 30),
('Second Sermon', 'Black Sherif', '[\"African\", \"Afrobeats\"]', './music/Black_Sherif_-_Second_Sermon_(Official_Video)(256k).mp3', 31),
('Shut Up', 'Black Sherif', '[\"African\", \"Afrobeats\"]', './music/Black_Sherif_-_Shut_Up__Audio_(256k).mp3', 33),
('Soja', 'Black Sherif', '[\"African\", \"Afrobeats\"]', './music/Black_Sherif_-_Soja__Official_Visualizer_(256k).mp3', 35),
('The Homeless Song', 'Black Sherif', '[\"African\", \"Afrobeats\"]', './music/Black_Sherif_-_The_Homeless_Song_[Official_Visualiser](256k).mp3', 36),
('Toxic Love City', 'Black Sherif', '[\"African\", \"Afrobeats\"]', './music/Black_Sherif_-_Toxic_Love_City_[Official_Audio](256k).mp3', 37),
('Wasteman', 'Black Sherif', '[\"African\", \"Afrobeats\"]', './music/Black_Sherif_-_Wasteman_[Official_Visualiser](256k).mp3', 38),
('YAYA', 'Black Sherif', '[\"African\", \"Afrobeats\"]', './music/Black_Sherif_-_YAYA__Official_Lyrics_video_(256k).mp3', 39),
('Zero', 'Black Sherif   Mabel', '[\"African\", \"Afrobeats\"]', './music/Black_Sherif___Mabel_-_Zero__Official_Video_(256k).mp3', 40),
('For My Hand', 'Burna Boy ft. Ed Sheeran', '[\"African\", \"Afrobeats\"]', './music/Burna_Boy_-_For_My_Hand_feat._Ed_Sheeran_[Official_Music_Video](256k).mp3', 41),
('It s Plenty', 'Burna Boy', '[\"African\", \"Afrobeats\"]', './music/Burna_Boy_-_It_s_Plenty_[Official_Audio](256k).mp3', 42),
('Last Last', 'Burna Boy', '[\"African\", \"Afrobeats\"]', './music/Burna_Boy_-_Last_Last_[Official_Music_Video](256k).mp3', 43),
('Rollercoaster', 'Burna Boy ft. J Balvin', '[\"African\", \"Afrobeats\"]', './music/Burna_Boy_-_Rollercoaster_(feat._J_Balvin)_[Official_Music_Video](256k).mp3', 44),
('Ye', 'Burna Boy', '[\"African\", \"Afrobeats\"]', './music/Burna_Boy_-_Ye_[Official_Music_Video](256k).mp3', 45),
('Bandana', 'Fireboy DML & Asake', '[\"African\", \"Afrobeats\"]', './music/Fireboy_DML_&_Asake_-_Bandana_(Official_Video)(256k).mp3', 46),
('All Of Us Ashawo', 'Fireboy DML', '[\"African\", \"Afrobeats\"]', './music/Fireboy_DML_-_All_Of_Us_(Ashawo)_(Official_Video)(256k).mp3', 47),
('Rebel', 'Black-Sherif JCKalinks', '[\"African\", \"Afrobeats\"]', './music/JC-Kalinks-Black-Sherif-Rebel.mp3', 48),
('Enemies', 'Jupitar ft Sarkodie', '[\"African\", \"Afrobeats\"]', './music/Jupitar_-_Enemies_ft_Sarkodie_{Official_Video}(256k).mp3', 49),
('Lomo-Lomo', 'KiDi ft-Black-Sherif', '[\"African\", \"Afrobeats\"]', './music/KiDi-Lomo-Lomo-ft-Black-Sherif.mp3', 50),
('Sikanii-Adwenfii-Feat-Kweku-Flick--Black-Sherif', 'Oseikrom', '[\"African\", \"Afrobeats\"]', './music/Oseikrom-Sikanii-Adwenfii-Feat-Kweku-Flick--Black-Sherif.mp3', 51),
('Sarkodie', 'Rap Attack', '[\"African\", \"Afrobeats\"]', './music/Rap_Attack_-_Sarkodie(256k).mp3', 52),
('Adonai', 'Sarkodie ft. Castro', '[\"African\", \"Afrobeats\"]', './music/Sarkodie_-_Adonai_ft._Castro_(Official_Video)(256k).mp3', 53),
('Illuminati', 'Sarkodie', '[\"African\", \"Afrobeats\"]', './music/Sarkodie_-_Illuminati_(Official_Video)(256k).mp3', 54),
('Oofeetsɔ', 'Sarkodie ft. Prince Bright Buk Bak', '[\"African\", \"Afrobeats\"]', './music/Sarkodie_-_Oofeetsɔ_ft._Prince_Bright_[Buk_Bak]_(Official_Video)(256k).mp3', 55),
('Original', 'Sarkodie', '[\"African\", \"Afrobeats\"]', './music/Sarkodie_-_Original_(Official_Video)(256k).mp3', 56),
('Saara ft. Efya', 'Sarkodie', '[\"African\", \"Afrobeats\"]', './music/Sarkodie_-_Saara_ft._Efya_(Official_Video)(256k).mp3', 57),
('Akwele Take', 'Shatta Wale', '[\"African\", \"Afrobeats\"]', './music/Shatta_Wale_-_Akwele_Take_(Official_Video)(256k).mp3', 58),
('Ayoo', 'Shatta Wale', '[\"African\", \"Afrobeats\"]', './music/Shatta_Wale_-_Ayoo_(Official_Video)(256k).mp3', 59),
('Baby Chop Kiss', 'Shatta Wale', '[\"African\", \"Afrobeats\"]', './music/Shatta_Wale_-_Baby_(Chop_Kiss)_[Official_Video](256k).mp3', 60),
('Badman', 'Shatta Wale', '[\"African\", \"Afrobeats\"]', './music/Shatta_Wale_-_Badman_(Official_video)(256k).mp3', 61),
('Bullet Proof', 'Shatta Wale', '[\"African\", \"Afrobeats\"]', './music/Shatta_Wale_-_Bullet_Proof_(Official_Video)(256k).mp3', 62),
('Kakai', 'Shatta Wale', '[\"African\", \"Afrobeats\"]', './music/Shatta_Wale_-_Kakai_(Official_Video)(256k).mp3', 63),
('My Level', 'Shatta Wale', '[\"African\", \"Afrobeats\"]', './music/Shatta_Wale_-_My_Level_(Official_Video)(256k).mp3', 64),
('Taking Over', 'Shatta Wale ft. Joint 77, Addi Self & Captan Official Video', '[\"African\", \"Afrobeats\"]', './music/Shatta_Wale_-_Taking_Over_ft._Joint_77,_Addi_Self_&_Captan_(Official_Video(256k).mp3', 65),
('Low Tempo', 'Shatta Wale ft Shatta Michy', '[\"African\", \"Afrobeats\"]', './music/Shatta_Wale_ft_Shatta_Michy_-_Low_Tempo_(Official_Video)(256k).mp3', 66),
('Fallen-Angel', 'SmallGod ft Black-Sherif', '[\"African\", \"Afrobeats\"]', './music/SmallGod-Fallen-Angel-ft-Black-Sherif.mp3', 67),
('Activate', 'Stonebwoy, Davido', '[\"African\", \"Afrobeats\"]', './music/Stonebwoy,_Davido_-_Activate_(Official_Video)(256k).mp3', 68),
('Bawasaaba', 'Stonebwoy', '[\"African\", \"Afrobeats\"]', './music/Stonebwoy_-_Bawasaaba_(Official_Vibes_Video)(256k).mp3', 69),
('Enku Lenu', 'Stonebwoy', '[\"African\", \"Afrobeats\"]', './music/Stonebwoy_-_Enku_Lenu_(Official_Video)(256k).mp3', 70),
('Ever Lasting', 'Stonebwoy', '[\"African\", \"Afrobeats\"]', './music/Stonebwoy_-_Ever_Lasting_(Official_Video)(256k).mp3', 71),
('GO HIGHER', 'STONEBWOY', '[\"African\", \"Afrobeats\"]', './music/STONEBWOY_-_GO_HIGHER_(_OFFICIAL_VIDEO)(256k).mp3', 72),
('Kpo K3K3', 'Stonebwoy ft. Medikal, DarkoVibes, Kelvyn Boy & Kwesi Arthur', '[\"African\", \"Afrobeats\"]', './music/Stonebwoy_-_Kpo_K3K3_ft._Medikal,_DarkoVibes,_Kelvyn_Boy_&_Kwesi_Arthur_(Official_Video)(256k).mp3', 73),
('Mightylele', 'Stonebwoy', '[\"African\", \"Afrobeats\"]', './music/Stonebwoy_-_Mightylele_(Official_Video)(256k).mp3', 74),
('My Name', 'Stonebwoy', '[\"African\", \"Afrobeats\"]', './music/Stonebwoy_-_My_Name_(Music_Video)(256k).mp3', 75),
('People Dey', 'Stonebwoy', '[\"African\", \"Afrobeats\"]', './music/Stonebwoy_-_People_Dey_(Official_Video)(256k).mp3', 76),
('Problem', 'Stonebwoy', '[\"African\", \"Afrobeats\"]', './music/Stonebwoy_-_Problem_(Official_Video)(256k).mp3', 77),
('Putuu Freestyle Pray', 'Stonebwoy', '[\"African\", \"Afrobeats\"]', './music/Stonebwoy_-_Putuu_Freestyle_[Pray]_(Official_Video)(256k).mp3', 78),
('Tomorrow', 'Stonebwoy', '[\"African\", \"Afrobeats\"]', './music/Stonebwoy_-_Tomorrow_(Official_Video)(256k).mp3', 79),
('Gbee Naabu', 'Yaa Pono', '[\"African\", \"Afrobeats\"]', './music/Yaa_Pono_-_Gbee_Naabu_(Video)(256k).mp3', 80);

-- --------------------------------------------------------

--
-- Table structure for table `tbl_unverified_user`
--

CREATE TABLE `tbl_unverified_user` (
  `email` varchar(100) DEFAULT NULL,
  `password` varchar(50) DEFAULT NULL,
  `username` varchar(100) DEFAULT NULL,
  `otp_code` varchar(10) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `gender` varchar(30) DEFAULT NULL,
  `date_of_birth` date DEFAULT NULL,
  `ID` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tbl_unverified_user`
--

INSERT INTO `tbl_unverified_user` (`email`, `password`, `username`, `otp_code`, `phone`, `gender`, `date_of_birth`, `ID`) VALUES
('asdas', NULL, NULL, NULL, NULL, NULL, NULL, 3);

-- --------------------------------------------------------

--
-- Table structure for table `tbl_user_data`
--

CREATE TABLE `tbl_user_data` (
  `email` varchar(100) DEFAULT NULL,
  `password` varchar(50) DEFAULT NULL,
  `user_name` varchar(100) DEFAULT NULL,
  `otp_code` varchar(10) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `gender` varchar(30) DEFAULT NULL,
  `date_of_birth` date DEFAULT NULL,
  `ID` int(11) NOT NULL,
  `user_friends` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tbl_user_data`
--

INSERT INTO `tbl_user_data` (`email`, `password`, `user_name`, `otp_code`, `phone`, `gender`, `date_of_birth`, `ID`, `user_friends`) VALUES
('reginaldtsinowpe05@gmail.com', '123456789b', 'Reginaldo', '876540', NULL, 'prefer-not-to-say', '2005-07-27', 6, 'Hallelujah'),
('reggietsinorreggie05@gmail.com', '123456789a', 'Hallelujah', '203369', NULL, 'man', '1993-06-21', 7, 'Reginaldo');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_user_playlist_data`
--

CREATE TABLE `tbl_user_playlist_data` (
  `id` int(11) NOT NULL,
  `user_name` varchar(255) NOT NULL,
  `playlists` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`playlists`))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `tbl_messages`
--
ALTER TABLE `tbl_messages`
  ADD PRIMARY KEY (`message_id`),
  ADD KEY `sender_id` (`sender_id`),
  ADD KEY `receiver_id` (`receiver_id`);

--
-- Indexes for table `tbl_musics`
--
ALTER TABLE `tbl_musics`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tbl_unverified_user`
--
ALTER TABLE `tbl_unverified_user`
  ADD PRIMARY KEY (`ID`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `username` (`username`);

--
-- Indexes for table `tbl_user_data`
--
ALTER TABLE `tbl_user_data`
  ADD PRIMARY KEY (`ID`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `user_name` (`user_name`);

--
-- Indexes for table `tbl_user_playlist_data`
--
ALTER TABLE `tbl_user_playlist_data`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `tbl_messages`
--
ALTER TABLE `tbl_messages`
  MODIFY `message_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `tbl_musics`
--
ALTER TABLE `tbl_musics`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=81;

--
-- AUTO_INCREMENT for table `tbl_unverified_user`
--
ALTER TABLE `tbl_unverified_user`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `tbl_user_data`
--
ALTER TABLE `tbl_user_data`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `tbl_user_playlist_data`
--
ALTER TABLE `tbl_user_playlist_data`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `tbl_messages`
--
ALTER TABLE `tbl_messages`
  ADD CONSTRAINT `tbl_messages_ibfk_1` FOREIGN KEY (`sender_id`) REFERENCES `tbl_user_data` (`user_name`),
  ADD CONSTRAINT `tbl_messages_ibfk_2` FOREIGN KEY (`receiver_id`) REFERENCES `tbl_user_data` (`user_name`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
