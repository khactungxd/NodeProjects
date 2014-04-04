-- phpMyAdmin SQL Dump
-- version 3.5.2
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: Jul 10, 2013 at 02:53 PM
-- Server version: 5.5.25a
-- PHP Version: 5.4.4

SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `helptable`
--

DELIMITER $$
--
-- Procedures
--
CREATE DEFINER=`root`@`localhost` PROCEDURE `test_multi_sets`()
    DETERMINISTIC
begin
        select user() as first_col;
        select user() as first_col, now() as second_col;
        select user() as first_col, now() as second_col, now() as third_col;
        end$$

DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `aa`
--

CREATE TABLE IF NOT EXISTS `aa` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `dsfsdfsdf` text NOT NULL,
  `This` text NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=6 ;

--
-- Dumping data for table `aa`
--

INSERT INTO `aa` (`id`, `dsfsdfsdf`, `This`) VALUES
(2, 'sdf', 'sdfsdf'),
(4, 'asdasd', '23213'),
(5, 'filter', 'result');

-- --------------------------------------------------------

--
-- Table structure for table `new`
--

CREATE TABLE IF NOT EXISTS `new` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table structure for table `sdfsdfsdf`
--

CREATE TABLE IF NOT EXISTS `sdfsdfsdf` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table structure for table `tb_data`
--

CREATE TABLE IF NOT EXISTS `tb_data` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` text NOT NULL,
  `age` int(11) NOT NULL,
  `city` text NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=70 ;

--
-- Dumping data for table `tb_data`
--

INSERT INTO `tb_data` (`id`, `name`, `age`, `city`) VALUES
(3, 'Tráng', 280, 'Hanoi'),
(8, 'Tu', 27, 'Hanoi'),
(10, 'asd$', 0, 'asd'),
(60, 'asd,a.a;a"a"', 0, 'asd'),
(62, '2', 2, '2'),
(63, 'Thinh', 25, 'Hanoi'),
(67, 'X1', 1, 'Hanoi'),
(68, 'X2', 2, 'Hanoi'),
(69, 'X3', 3, 'Hanoi');

-- --------------------------------------------------------

--
-- Table structure for table `tb_flags`
--

CREATE TABLE IF NOT EXISTS `tb_flags` (
  `xID` int(11) NOT NULL AUTO_INCREMENT,
  `xTableName` varchar(30) NOT NULL,
  `xFieldName` varchar(50) NOT NULL,
  `xIsFilter` tinyint(4) NOT NULL,
  `xIsVisual` tinyint(4) NOT NULL,
  `xIsResult` tinyint(4) NOT NULL,
  `xUpdateTime` datetime NOT NULL,
  PRIMARY KEY (`xID`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=21 ;

--
-- Dumping data for table `tb_flags`
--

INSERT INTO `tb_flags` (`xID`, `xTableName`, `xFieldName`, `xIsFilter`, `xIsVisual`, `xIsResult`, `xUpdateTime`) VALUES
(2, '111', 'a', 0, 1, 1, '2013-07-07 00:49:14'),
(8, '111', 'b', 0, 1, 1, '2013-07-07 00:49:16'),
(9, '111', 'b2', 0, 1, 1, '2013-07-07 00:52:08'),
(10, '111', 'a2', 0, 1, 0, '2013-07-07 00:52:11'),
(11, '111', 'c', 0, 0, 0, '2013-07-07 00:54:34'),
(12, '111', 'd', 1, 0, 0, '2013-07-07 00:54:37'),
(13, '111', 'e', 0, 1, 1, '2013-07-07 00:54:42'),
(14, 'zz', 'asd', 0, 1, 1, '2013-07-07 04:03:31'),
(15, 'tb_data', 'age', 1, 1, 0, '2013-07-07 04:46:00'),
(16, 'tb_data', 'city', 1, 1, 1, '2013-07-10 19:25:40'),
(17, 'tb_data', 'name', 1, 1, 1, '2013-07-10 19:28:10'),
(18, 'aa', 'dsfsdfsdf', 0, 1, 0, '2013-07-10 19:36:20'),
(19, 'aa', 'sdfsdfsdf', 0, 1, 0, '2013-07-09 16:59:09'),
(20, 'aa', 'This', 1, 1, 1, '2013-07-10 19:35:28');

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
