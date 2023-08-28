/*
SQLyog Ultimate v13.1.1 (64 bit)
MySQL - 8.0.19 : Database - ecas
*********************************************************************
*/

/*!40101 SET NAMES utf8 */;

/*!40101 SET SQL_MODE=''*/;

/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
CREATE DATABASE /*!32312 IF NOT EXISTS*/`ecas` /*!40100 DEFAULT CHARACTER SET utf8 COLLATE utf8_unicode_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;

USE `ecas`;

/*Table structure for table `bienes_actividades` */

DROP TABLE IF EXISTS `bienes_actividades`;

CREATE TABLE `bienes_actividades` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `nomb_acti` varchar(250) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `categoria` int NOT NULL,
  `periodo` varchar(10) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `descripcion` text CHARACTER SET utf8 COLLATE utf8_unicode_ci,
  `id_creador` varchar(30) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `sesiones` int DEFAULT '1',
  `cupos` int DEFAULT '0',
  `id_depart` int DEFAULT NULL,
  `idBonus` int DEFAULT NULL,
  `marc_temp` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `marc_update` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `tipo_aprob` int DEFAULT NULL,
  `dni_docente` varchar(30) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL,
  `horas_cert` time DEFAULT NULL,
  `eliminado` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `FK_bienes_actividades_tipo` (`categoria`),
  KEY `FK_actividades_depart` (`id_depart`),
  KEY `FK_actividad_tipoaproba` (`tipo_aprob`),
  KEY `FK_actividad_periodo` (`periodo`),
  KEY `Fk_bonus_recompensa` (`idBonus`),
  KEY `FK_activDocenteResponsable` (`dni_docente`),
  CONSTRAINT `FK_activDocenteResponsable` FOREIGN KEY (`dni_docente`) REFERENCES `bienes_admin` (`dni_admin`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `FK_actividad_periodo` FOREIGN KEY (`periodo`) REFERENCES `bienes_periodo` (`periodo`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `FK_actividad_tipoaproba` FOREIGN KEY (`tipo_aprob`) REFERENCES `bienes_aprobaciones_tipo` (`id_tapro`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `FK_actividades_depart` FOREIGN KEY (`id_depart`) REFERENCES `bienes_departamentos` (`id_depart`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `FK_bienes_actividades_tipo` FOREIGN KEY (`categoria`) REFERENCES `bienes_actividades_categoria` (`tipo_acti`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `Fk_bonus_recompensa` FOREIGN KEY (`idBonus`) REFERENCES `bienes_lealtad_bonos` (`idBonus`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=1315 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

/*Table structure for table `bienes_actividades_categoria` */

DROP TABLE IF EXISTS `bienes_actividades_categoria`;

CREATE TABLE `bienes_actividades_categoria` (
  `tipo_acti` int NOT NULL COMMENT 'Codigo secuencial del tipo de actividad',
  `desc_acti` varchar(200) NOT NULL DEFAULT '' COMMENT 'Descripcion de la actividad',
  PRIMARY KEY (`tipo_acti`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 CHECKSUM=1 DELAY_KEY_WRITE=1 ROW_FORMAT=DYNAMIC COMMENT='Lista de valores con los tipos de actividad de bienestar o e';

/*Table structure for table `bienes_actividades_horarios` */

DROP TABLE IF EXISTS `bienes_actividades_horarios`;

CREATE TABLE `bienes_actividades_horarios` (
  `id_actividad` bigint NOT NULL,
  `item` int NOT NULL,
  `fecha` date DEFAULT NULL,
  `hora_ini` time DEFAULT NULL,
  `hora_fin` time DEFAULT NULL,
  `enlace_url` varchar(250) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL,
  `expositores` text CHARACTER SET utf8 COLLATE utf8_unicode_ci,
  `tipo_sesion` enum('PRESENCIAL','VIRTUAL','HIBRIDA') CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL,
  `lugar_sesion` varchar(1024) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL,
  `id_creador` varchar(30) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL,
  `descripcion` varchar(1024) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL,
  `marc_temp` datetime DEFAULT CURRENT_TIMESTAMP,
  `eliminado` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id_actividad`,`item`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

/*Table structure for table `bienes_actividades_participantes` */

DROP TABLE IF EXISTS `bienes_actividades_participantes`;

CREATE TABLE `bienes_actividades_participantes` (
  `id_actividad` bigint NOT NULL,
  `item` int NOT NULL,
  `id_participante` varchar(30) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `estado` int DEFAULT '1',
  `observacion` varchar(256) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL,
  `dni_docente` varchar(30) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL,
  `marc_update` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `marc_temp` datetime DEFAULT CURRENT_TIMESTAMP,
  `horas` time DEFAULT NULL,
  PRIMARY KEY (`id_participante`,`id_actividad`,`item`),
  KEY `FK_bienes_actividades_participantes_hora` (`id_actividad`,`item`),
  KEY `fk-bienespart-estado` (`estado`),
  CONSTRAINT `fk-actividades-participantes-horarios` FOREIGN KEY (`id_actividad`) REFERENCES `bienes_actividades_horarios` (`id_actividad`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk-bienespart-estado` FOREIGN KEY (`estado`) REFERENCES `bienes_actividades_participantes_estado` (`cod_estado`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

/*Table structure for table `bienes_actividades_participantes_calificacion` */

DROP TABLE IF EXISTS `bienes_actividades_participantes_calificacion`;

CREATE TABLE `bienes_actividades_participantes_calificacion` (
  `id_acti` bigint NOT NULL,
  `dni_part` varchar(30) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `califica` tinyint DEFAULT NULL,
  `comentario` text CHARACTER SET utf8 COLLATE utf8_unicode_ci,
  `marc_temp` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_acti`,`dni_part`),
  KEY `FK_participantes_califica` (`dni_part`),
  CONSTRAINT `FK_califica_actividades` FOREIGN KEY (`id_acti`) REFERENCES `bienes_actividades` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `FK_participantes_califica` FOREIGN KEY (`dni_part`) REFERENCES `bienes_participantes` (`dni_part`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

/*Table structure for table `bienes_actividades_participantes_estado` */

DROP TABLE IF EXISTS `bienes_actividades_participantes_estado`;

CREATE TABLE `bienes_actividades_participantes_estado` (
  `cod_estado` int NOT NULL AUTO_INCREMENT,
  `nomb_estado` varchar(64) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL,
  `suma_horas` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`cod_estado`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

/*Table structure for table `bienes_actividades_participantes_historico` */

DROP TABLE IF EXISTS `bienes_actividades_participantes_historico`;

CREATE TABLE `bienes_actividades_participantes_historico` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `id_actividad` bigint NOT NULL,
  `item` int NOT NULL,
  `id_participante` varchar(30) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `estado` int DEFAULT NULL,
  `dni_docente` varchar(30) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL,
  `marc_temp` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=110126 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

/*Table structure for table `bienes_actividades_programa` */

DROP TABLE IF EXISTS `bienes_actividades_programa`;

CREATE TABLE `bienes_actividades_programa` (
  `id_acti` bigint DEFAULT NULL,
  `id_prog` tinyint DEFAULT NULL,
  KEY `FK_programa_actividades` (`id_prog`),
  KEY `FK_actividades_programas` (`id_acti`),
  CONSTRAINT `FK_actividades_programas` FOREIGN KEY (`id_acti`) REFERENCES `bienes_actividades` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `FK_programa_actividades` FOREIGN KEY (`id_prog`) REFERENCES `bienes_programas` (`codi_prog`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

/*Table structure for table `bienes_actividades_role` */

DROP TABLE IF EXISTS `bienes_actividades_role`;

CREATE TABLE `bienes_actividades_role` (
  `id_acti` bigint DEFAULT NULL,
  `id_role` tinyint DEFAULT NULL,
  KEY `FK_bienes_roles` (`id_acti`),
  KEY `FK_rol_actividades` (`id_role`),
  CONSTRAINT `FK_bienes_roles` FOREIGN KEY (`id_acti`) REFERENCES `bienes_actividades` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `FK_rol_actividades` FOREIGN KEY (`id_role`) REFERENCES `bienes_participantes_role` (`id_rol`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

/*Table structure for table `bienes_admin` */

DROP TABLE IF EXISTS `bienes_admin`;

CREATE TABLE `bienes_admin` (
  `dni_admin` varchar(32) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `nomb_admin` varchar(128) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL,
  `apel_admin` varchar(128) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL,
  `email_admin` varchar(128) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `idTipo` int NOT NULL,
  `address` varchar(512) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL,
  `enabled` tinyint(1) DEFAULT '1',
  `aprueba_bienestar` tinyint(1) DEFAULT '0' COMMENT '1 si tiene permisos para realizar la aprobación de bienestar en general',
  PRIMARY KEY (`dni_admin`,`email_admin`,`idTipo`),
  KEY `FK_tipo_admin` (`idTipo`),
  CONSTRAINT `FK_tipo_admin` FOREIGN KEY (`idTipo`) REFERENCES `bienes_admin_tipo` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

/*Table structure for table `bienes_admin_departamentos` */

DROP TABLE IF EXISTS `bienes_admin_departamentos`;

CREATE TABLE `bienes_admin_departamentos` (
  `dni_admin` varchar(32) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `codi_depart` int NOT NULL,
  PRIMARY KEY (`dni_admin`,`codi_depart`),
  KEY `FK_admindepart_deapart` (`codi_depart`),
  CONSTRAINT `FK_admindepart_admin` FOREIGN KEY (`dni_admin`) REFERENCES `bienes_admin` (`dni_admin`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `FK_admindepart_deapart` FOREIGN KEY (`codi_depart`) REFERENCES `bienes_departamentos` (`id_depart`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

/*Table structure for table `bienes_admin_tipo` */

DROP TABLE IF EXISTS `bienes_admin_tipo`;

CREATE TABLE `bienes_admin_tipo` (
  `id` int NOT NULL AUTO_INCREMENT,
  `tipo` varchar(32) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

/*Table structure for table `bienes_aprobaciones_actividades` */

DROP TABLE IF EXISTS `bienes_aprobaciones_actividades`;

CREATE TABLE `bienes_aprobaciones_actividades` (
  `id_aproba` bigint NOT NULL AUTO_INCREMENT,
  `id_actividad` bigint DEFAULT NULL,
  `dni_part` varchar(30) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL,
  `id_creador` varchar(30) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL,
  `aprobado` tinyint(1) DEFAULT '0',
  `marc_temp` datetime DEFAULT CURRENT_TIMESTAMP,
  `marc_update` datetime DEFAULT CURRENT_TIMESTAMP,
  `anulado` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id_aproba`),
  KEY `FK_participante_activaprobadas` (`dni_part`),
  KEY `FK_actividades_aproba` (`id_actividad`),
  CONSTRAINT `FK_actividades_aproba` FOREIGN KEY (`id_actividad`) REFERENCES `bienes_actividades` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `FK_participante_activaprobadas` FOREIGN KEY (`dni_part`) REFERENCES `bienes_participantes` (`dni_part`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=30422 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

/*Table structure for table `bienes_aprobaciones_certificados` */

DROP TABLE IF EXISTS `bienes_aprobaciones_certificados`;

CREATE TABLE `bienes_aprobaciones_certificados` (
  `id_aproba` bigint NOT NULL,
  `emitido` tinyint(1) DEFAULT '0',
  `file` varchar(1024) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL,
  `description` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin,
  `active` varchar(32) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL,
  `marc_temp` datetime DEFAULT CURRENT_TIMESTAMP,
  `marc_update` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `eth_indexcert` varchar(64) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL,
  `eth_address` varchar(512) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL,
  `eth_contract` varchar(512) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL,
  `eth_transact` varchar(512) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL,
  `eth_network` varchar(32) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL,
  `eth_date` datetime DEFAULT NULL,
  `url_file` varchar(1024) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL,
  `eth_transact_revoke` varchar(512) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL,
  `eth_date_revoke` datetime DEFAULT NULL,
  PRIMARY KEY (`id_aproba`),
  CONSTRAINT `bienes_aprobaciones_certificados_chk_1` CHECK (json_valid(`description`))
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

/*Table structure for table `bienes_aprobaciones_participantes` */

DROP TABLE IF EXISTS `bienes_aprobaciones_participantes`;

CREATE TABLE `bienes_aprobaciones_participantes` (
  `id_aproba` int NOT NULL AUTO_INCREMENT,
  `dni_part` varchar(30) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `id_tapro` int DEFAULT NULL,
  `obser_aproba` varchar(1024) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL,
  `periodo_aproba` varchar(10) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `id_creador` varchar(20) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL,
  `marc_temp` datetime DEFAULT CURRENT_TIMESTAMP,
  `marc_update` datetime DEFAULT CURRENT_TIMESTAMP,
  `anulado` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id_aproba`),
  KEY `FK_aprobacion_tipo` (`id_tapro`),
  KEY `FK_participantes_aprobado` (`dni_part`),
  KEY `fk_periodo_aprobacion` (`periodo_aproba`),
  CONSTRAINT `FK_aprobacion_tipo` FOREIGN KEY (`id_tapro`) REFERENCES `bienes_aprobaciones_tipo` (`id_tapro`) ON UPDATE CASCADE,
  CONSTRAINT `FK_participantes_aprobado` FOREIGN KEY (`dni_part`) REFERENCES `bienes_participantes` (`dni_part`),
  CONSTRAINT `fk_periodo_aprobacion` FOREIGN KEY (`periodo_aproba`) REFERENCES `bienes_periodo` (`periodo`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=225 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

/*Table structure for table `bienes_aprobaciones_tipo` */

DROP TABLE IF EXISTS `bienes_aprobaciones_tipo`;

CREATE TABLE `bienes_aprobaciones_tipo` (
  `id_tapro` int NOT NULL AUTO_INCREMENT,
  `nomb_tapro` varchar(128) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `desc_aprob` text CHARACTER SET utf8 COLLATE utf8_unicode_ci,
  `acum_horas` tinyint(1) DEFAULT '1',
  `certifica` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id_tapro`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

/*Table structure for table `bienes_config` */

DROP TABLE IF EXISTS `bienes_config`;

CREATE TABLE `bienes_config` (
  `nomb_conf` varchar(64) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `valor_conf` text CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  PRIMARY KEY (`nomb_conf`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

/*Table structure for table `bienes_departamentos` */

DROP TABLE IF EXISTS `bienes_departamentos`;

CREATE TABLE `bienes_departamentos` (
  `id_depart` int NOT NULL AUTO_INCREMENT,
  `nomb_depart` varchar(64) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id_depart`)
) ENGINE=InnoDB AUTO_INCREMENT=56 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

/*Table structure for table `bienes_lealtad` */

DROP TABLE IF EXISTS `bienes_lealtad`;

CREATE TABLE `bienes_lealtad` (
  `min_point` int DEFAULT NULL,
  `max_point` int DEFAULT NULL,
  `name` varchar(128) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL,
  `factor` decimal(13,4) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

/*Table structure for table `bienes_lealtad_bonos` */

DROP TABLE IF EXISTS `bienes_lealtad_bonos`;

CREATE TABLE `bienes_lealtad_bonos` (
  `idBonus` int NOT NULL AUTO_INCREMENT,
  `namebonus` varchar(64) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL,
  `points` decimal(10,0) DEFAULT NULL,
  PRIMARY KEY (`idBonus`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

/*Table structure for table `bienes_lealtad_caja` */

DROP TABLE IF EXISTS `bienes_lealtad_caja`;

CREATE TABLE `bienes_lealtad_caja` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `monto` decimal(10,0) DEFAULT NULL,
  `mensaje` varchar(1024) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL,
  `id_transac` bigint DEFAULT NULL,
  `id_creador` varchar(30) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL,
  `marc_temp` datetime DEFAULT CURRENT_TIMESTAMP,
  `marc_update` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

/*Table structure for table `bienes_lealtad_tipo_transaccion` */

DROP TABLE IF EXISTS `bienes_lealtad_tipo_transaccion`;

CREATE TABLE `bienes_lealtad_tipo_transaccion` (
  `id` tinyint NOT NULL AUTO_INCREMENT,
  `name` varchar(64) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

/*Table structure for table `bienes_lealtad_transaccion_estados` */

DROP TABLE IF EXISTS `bienes_lealtad_transaccion_estados`;

CREATE TABLE `bienes_lealtad_transaccion_estados` (
  `id` tinyint NOT NULL AUTO_INCREMENT,
  `name` varchar(64) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

/*Table structure for table `bienes_lealtad_transaccion_historico` */

DROP TABLE IF EXISTS `bienes_lealtad_transaccion_historico`;

CREATE TABLE `bienes_lealtad_transaccion_historico` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `idTransaccion` bigint NOT NULL,
  `estado` tinyint DEFAULT NULL,
  `mensaje` varchar(128) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL,
  `marc_temp` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `Fk_hostorico_transac` (`idTransaccion`),
  CONSTRAINT `Fk_hostorico_transac` FOREIGN KEY (`idTransaccion`) REFERENCES `bienes_lealtad_transacciones` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

/*Table structure for table `bienes_lealtad_transacciones` */

DROP TABLE IF EXISTS `bienes_lealtad_transacciones`;

CREATE TABLE `bienes_lealtad_transacciones` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `dni_part` varchar(30) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `monto` decimal(10,0) NOT NULL,
  `idTipo` tinyint NOT NULL,
  `idEstado` tinyint NOT NULL DEFAULT '1',
  `mensaje` varchar(256) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL,
  `IdAprobacion` bigint DEFAULT NULL,
  `IdRedencion` bigint DEFAULT NULL,
  `marc_temp` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `marc_update` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `eth_transact` varchar(512) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `Fk-tipo-transac` (`idTipo`),
  KEY `Fk_estado_trasac` (`idEstado`),
  KEY `FK_aprobacion_activi` (`IdAprobacion`),
  CONSTRAINT `Fk-tipo-transac` FOREIGN KEY (`idTipo`) REFERENCES `bienes_lealtad_tipo_transaccion` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `FK_aprobacion_activi` FOREIGN KEY (`IdAprobacion`) REFERENCES `bienes_aprobaciones_actividades` (`id_aproba`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `Fk_estado_trasac` FOREIGN KEY (`idEstado`) REFERENCES `bienes_lealtad_transaccion_estados` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=44 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

/*Table structure for table `bienes_participantes` */

DROP TABLE IF EXISTS `bienes_participantes`;

CREATE TABLE `bienes_participantes` (
  `codnum_part` varchar(10) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL,
  `dni_part` varchar(30) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `nomb_part` varchar(128) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL,
  `apel_part` varchar(128) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL,
  `email_part` varchar(128) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL,
  `role_part` tinyint DEFAULT NULL,
  `codprog_part` tinyint DEFAULT NULL,
  `marc_temp` datetime DEFAULT CURRENT_TIMESTAMP,
  `address` varchar(512) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`dni_part`),
  KEY `FK_participantesPrograma` (`codprog_part`),
  KEY `FK-participa-role` (`role_part`),
  CONSTRAINT `FK-participa-role` FOREIGN KEY (`role_part`) REFERENCES `bienes_participantes_role` (`id_rol`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `FK_participantesPrograma` FOREIGN KEY (`codprog_part`) REFERENCES `bienes_programas` (`codi_prog`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

/*Table structure for table `bienes_participantes_copy` */

DROP TABLE IF EXISTS `bienes_participantes_copy`;

CREATE TABLE `bienes_participantes_copy` (
  `codnum_part` varchar(10) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL,
  `dni_part` varchar(30) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `nomb_part` varchar(128) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL,
  `apel_part` varchar(128) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL,
  `email_part` varchar(128) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL,
  `role_part` tinyint DEFAULT NULL,
  `codprog_part` tinyint DEFAULT NULL,
  `marc_temp` datetime DEFAULT CURRENT_TIMESTAMP,
  `address` varchar(512) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`dni_part`),
  KEY `FK_participantesPrograma` (`codprog_part`),
  KEY `FK-participa-role` (`role_part`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

/*Table structure for table `bienes_participantes_role` */

DROP TABLE IF EXISTS `bienes_participantes_role`;

CREATE TABLE `bienes_participantes_role` (
  `id_rol` tinyint NOT NULL AUTO_INCREMENT,
  `desc_rol` varchar(32) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL,
  `programa` tinyint DEFAULT '0',
  PRIMARY KEY (`id_rol`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

/*Table structure for table `bienes_periodo` */

DROP TABLE IF EXISTS `bienes_periodo`;

CREATE TABLE `bienes_periodo` (
  `periodo` varchar(10) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `fech_ini` date NOT NULL,
  `fech_fin` date NOT NULL,
  PRIMARY KEY (`periodo`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

/*Table structure for table `bienes_programas` */

DROP TABLE IF EXISTS `bienes_programas`;

CREATE TABLE `bienes_programas` (
  `codi_prog` tinyint NOT NULL,
  `nomb_prog` varchar(250) NOT NULL,
  `ciudad` varchar(64) NOT NULL,
  `activo` int NOT NULL DEFAULT '1',
  PRIMARY KEY (`codi_prog`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

/*Table structure for table `bienes_redenciones` */

DROP TABLE IF EXISTS `bienes_redenciones`;

CREATE TABLE `bienes_redenciones` (
  `id_reden` bigint NOT NULL AUTO_INCREMENT,
  `monto` int DEFAULT NULL,
  `concepto` varchar(1024) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL,
  `dni_part` varchar(30) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL,
  `id_creador` varchar(30) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL,
  `id_act_anulada` bigint DEFAULT NULL,
  `anulado` tinyint(1) DEFAULT '0',
  `marc_temp` datetime DEFAULT CURRENT_TIMESTAMP,
  `marc_update` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_reden`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

/*Table structure for table `history_datos1` */

DROP TABLE IF EXISTS `history_datos1`;

CREATE TABLE `history_datos1` (
  `id_ea` int NOT NULL AUTO_INCREMENT,
  `estudiante` char(50) NOT NULL,
  `facultad` char(50) DEFAULT NULL,
  `actividad` char(50) NOT NULL,
  `ano` varchar(10) NOT NULL,
  PRIMARY KEY (`id_ea`)
) ENGINE=MyISAM AUTO_INCREMENT=26412 DEFAULT CHARSET=utf8;

/*Table structure for table `history_datos2` */

DROP TABLE IF EXISTS `history_datos2`;

CREATE TABLE `history_datos2` (
  `dni` double DEFAULT NULL,
  `nombres` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL,
  `actividad` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL,
  `grupo` int DEFAULT NULL,
  `instructor` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL,
  `periodo` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL,
  `estado` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL,
  `codprog` int DEFAULT NULL,
  `programa` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

/* Trigger structure for table `bienes_actividades_horarios` */

DELIMITER $$

/*!50003 DROP TRIGGER*//*!50032 IF EXISTS */ /*!50003 `delete_actividades_horario` */$$

/*!50003 CREATE */ /*!50017 DEFINER = 'josue.rivera'@'%' */ /*!50003 TRIGGER `delete_actividades_horario` AFTER UPDATE ON `bienes_actividades_horarios` FOR EACH ROW BEGIN
	if (NEW.eliminado = 1) then
		DELETE FROM `bienes_actividades_participantes` WHERE `id_actividad` = OLD.id_actividad AND `item` = OLD.item;
	end if;
    END */$$


DELIMITER ;

/* Trigger structure for table `bienes_actividades_participantes` */

DELIMITER $$

/*!50003 DROP TRIGGER*//*!50032 IF EXISTS */ /*!50003 `update_actividad_participantes_estado` */$$

/*!50003 CREATE */ /*!50017 DEFINER = 'josue.rivera'@'%' */ /*!50003 TRIGGER `update_actividad_participantes_estado` BEFORE UPDATE ON `bienes_actividades_participantes` FOR EACH ROW BEGIN
	INSERT INTO ecas.bienes_actividades_participantes_historico (id_actividad,item,id_participante,estado,dni_docente) VALUES(OLD.id_actividad,OLD.item,OLD.id_participante,OLD.estado,OLD.dni_docente);
	if (select suma_horas from bienes_actividades_participantes_estado where cod_estado=NEW.estado) then
	SET NEW.horas= (SELECT TIMEDIFF(bh.hora_fin,bh.hora_ini) AS horasac FROM bienes_actividades_horarios AS bh WHERE id_actividad=OLD.id_actividad AND item=OLD.item); 
	else
	SET NEW.horas= null;
	end if;
    END */$$


DELIMITER ;

/* Trigger structure for table `bienes_aprobaciones_actividades` */

DELIMITER $$

/*!50003 DROP TRIGGER*//*!50032 IF EXISTS */ /*!50003 `insert_aprob_actividad` */$$

/*!50003 CREATE */ /*!50017 DEFINER = 'josue.rivera'@'%' */ /*!50003 TRIGGER `insert_aprob_actividad` AFTER INSERT ON `bienes_aprobaciones_actividades` FOR EACH ROW BEGIN
	
	IF(NEW.aprobado IS TRUE) THEN	
	
		SET @m = (SELECT getPointsBonus(idBonus) FROM bienes_actividades WHERE id=NEW.id_actividad);
	
		IF (@m > 0) THEN 
	
			INSERT INTO bienes_lealtad_transacciones (dni_part,monto,idTipo,IdAprobacion) VALUES (NEW.dni_part,@m,'1',NEW.id_aproba);
		END IF;
	
	
	SET @c = (SELECT esCertificable(NEW.id_actividad));
		IF(@c IS TRUE) THEN
			INSERT INTO bienes_aprobaciones_certificados (id_aproba) VALUES (NEW.id_aproba);
		END IF;

	END IF;
    END */$$


DELIMITER ;

/* Trigger structure for table `bienes_aprobaciones_actividades` */

DELIMITER $$

/*!50003 DROP TRIGGER*//*!50032 IF EXISTS */ /*!50003 `update_aprob_actividad` */$$

/*!50003 CREATE */ /*!50017 DEFINER = 'josue.rivera'@'%' */ /*!50003 TRIGGER `update_aprob_actividad` AFTER UPDATE ON `bienes_aprobaciones_actividades` FOR EACH ROW BEGIN
	if (NEW.anulado is true) then
		SET @m = (SELECT getPointsBonus(idBonus) FROM bienes_actividades WHERE id=NEW.id_actividad);
		
		
		IF (@m > 0 and NEW.aprobado is true) THEN 
			set @m = @m * -1;
			INSERT INTO bienes_lealtad_transacciones (dni_part,monto,idTipo,IdAprobacion) VALUES (NEW.dni_part,@m,'4',NEW.id_aproba);
		END IF;
		
		update bienes_aprobaciones_certificados set active = false where id_aproba=OLD.id_aproba;

	end if;
    END */$$


DELIMITER ;

/* Trigger structure for table `bienes_lealtad_transacciones` */

DELIMITER $$

/*!50003 DROP TRIGGER*//*!50032 IF EXISTS */ /*!50003 `update_transaccion_estado` */$$

/*!50003 CREATE */ /*!50017 DEFINER = 'josue.rivera'@'%' */ /*!50003 TRIGGER `update_transaccion_estado` AFTER UPDATE ON `bienes_lealtad_transacciones` FOR EACH ROW BEGIN
	INSERT INTO ecas.bienes_lealtad_transaccion_historico (idTransaccion, estado,mensaje) VALUES (OLD.id,OLD.idEstado,OLD.mensaje);
    END */$$


DELIMITER ;

/* Function  structure for function  `periodoActivo` */

/*!50003 DROP FUNCTION IF EXISTS `periodoActivo` */;
DELIMITER $$

/*!50003 CREATE DEFINER=`josue.rivera`@`%` FUNCTION `periodoActivo`() RETURNS varchar(10) CHARSET utf8
    DETERMINISTIC
BEGIN
	SET @p = '';
	 SELECT periodo INTO @p FROM bienes_periodo WHERE fech_ini <= NOW() AND NOW() <= fech_fin LIMIT 1;
	RETURN @p;
    END */$$
DELIMITER ;

/* Function  structure for function  `getTipo` */

/*!50003 DROP FUNCTION IF EXISTS `getTipo` */;
DELIMITER $$

/*!50003 CREATE DEFINER=`josue.rivera`@`%` FUNCTION `getTipo`(id INT) RETURNS varchar(20) CHARSET utf8
    DETERMINISTIC
BEGIN
	SET @tipo = '0 sesiones';
	SELECT COUNT(*) INTO @cant FROM bienes_actividades_horarios WHERE id_actividad = id;
	IF(@cant > 1) THEN
		SET @tipo = CONCAT(@cant,' sesiones');
	END IF;
	IF(@cant = 1) THEN
		SET @tipo = CONCAT(@cant,' sesión');
	END IF;
	RETURN @tipo;
    END */$$
DELIMITER ;

/* Function  structure for function  `getCategoriaActividad` */

/*!50003 DROP FUNCTION IF EXISTS `getCategoriaActividad` */;
DELIMITER $$

/*!50003 CREATE DEFINER=`josue.rivera`@`%` FUNCTION `getCategoriaActividad`(id INT) RETURNS varchar(64) CHARSET utf8
    DETERMINISTIC
BEGIN
    SET @c = '';
	Select desc_acti into @c from bienes_actividades_categoria Where tipo_acti=id;
	RETURN @c;
    END */$$
DELIMITER ;

/* Function  structure for function  `getDepartamento` */

/*!50003 DROP FUNCTION IF EXISTS `getDepartamento` */;
DELIMITER $$

/*!50003 CREATE DEFINER=`josue.rivera`@`%` FUNCTION `getDepartamento`(id INT) RETURNS varchar(64) CHARSET utf8
    DETERMINISTIC
BEGIN
	SET @c = '';
	SELECT nomb_depart INTO @c FROM bienes_departamentos WHERE id_depart=id;
	RETURN @c;
    END */$$
DELIMITER ;

/* Function  structure for function  `getPointsBonus` */

/*!50003 DROP FUNCTION IF EXISTS `getPointsBonus` */;
DELIMITER $$

/*!50003 CREATE DEFINER=`josue.rivera`@`%` FUNCTION `getPointsBonus`(id INT) RETURNS varchar(64) CHARSET utf8
    DETERMINISTIC
BEGIN
	SET @c = '';
	SELECT points INTO @c FROM bienes_lealtad_bonos WHERE idBonus=id;
	RETURN @c;
    END */$$
DELIMITER ;

/* Function  structure for function  `getProgramaOfertaActividad` */

/*!50003 DROP FUNCTION IF EXISTS `getProgramaOfertaActividad` */;
DELIMITER $$

/*!50003 CREATE DEFINER=`josue.rivera`@`%` FUNCTION `getProgramaOfertaActividad`(id INT) RETURNS varchar(128) CHARSET utf8
    DETERMINISTIC
BEGIN
	SET @c = '';
	SELECT GROUP_CONCAT(id_prog) into @c FROM bienes_actividades_programa WHERE id_acti=id;
	RETURN @c;
    END */$$
DELIMITER ;

/* Function  structure for function  `getRoleOfertaActividad` */

/*!50003 DROP FUNCTION IF EXISTS `getRoleOfertaActividad` */;
DELIMITER $$

/*!50003 CREATE DEFINER=`josue.rivera`@`%` FUNCTION `getRoleOfertaActividad`(id INT) RETURNS varchar(128) CHARSET utf8
    DETERMINISTIC
BEGIN
	SET @c = '';
	SELECT GROUP_CONCAT(id_role) INTO @c FROM bienes_actividades_role WHERE id_acti=id;
	RETURN @c;
    END */$$
DELIMITER ;

/* Function  structure for function  `esParticipanteActividad` */

/*!50003 DROP FUNCTION IF EXISTS `esParticipanteActividad` */;
DELIMITER $$

/*!50003 CREATE DEFINER=`josue.rivera`@`%` FUNCTION `esParticipanteActividad`(id int, id_part varchar(30)) RETURNS tinyint
    DETERMINISTIC
BEGIN
	SET @c = 0;
	set @r = false;
	SELECT count(id_participante) INTO @c FROM bienes_actividades_participantes WHERE id_actividad=id and id_participante=id_part;
	if(@c > 0) then
		set @r = true;
	END IF;
	RETURN @r;
    END */$$
DELIMITER ;

/* Function  structure for function  `getRoleNameOfertaActividad` */

/*!50003 DROP FUNCTION IF EXISTS `getRoleNameOfertaActividad` */;
DELIMITER $$

/*!50003 CREATE DEFINER=`josue.rivera`@`%` FUNCTION `getRoleNameOfertaActividad`(id INT) RETURNS varchar(1024) CHARSET utf8
    DETERMINISTIC
BEGIN
	SET @c = '';
	SELECT GROUP_CONCAT(pr.desc_rol) INTO @c FROM bienes_actividades_role AS r INNER JOIN bienes_participantes_role AS pr ON r.id_role=pr.id_rol WHERE r.id_acti=id;
	RETURN @c;
    END */$$
DELIMITER ;

/* Function  structure for function  `getProgramaNameOfertaActividad` */

/*!50003 DROP FUNCTION IF EXISTS `getProgramaNameOfertaActividad` */;
DELIMITER $$

/*!50003 CREATE DEFINER=`josue.rivera`@`%` FUNCTION `getProgramaNameOfertaActividad`(id INT) RETURNS varchar(1024) CHARSET utf8
    DETERMINISTIC
BEGIN
	SET @c = '';
	SELECT GROUP_CONCAT(pr.nomb_prog) INTO @c FROM bienes_actividades_programa AS r INNER JOIN bienes_programas AS pr ON r.id_prog=pr.codi_prog WHERE r.id_acti=id;
	RETURN @c;
    END */$$
DELIMITER ;

/* Function  structure for function  `getSesiones` */

/*!50003 DROP FUNCTION IF EXISTS `getSesiones` */;
DELIMITER $$

/*!50003 CREATE DEFINER=`josue.rivera`@`%` FUNCTION `getSesiones`(idact INT) RETURNS varchar(64) CHARSET utf8
    DETERMINISTIC
BEGIN
	SET @c = '';
	SELECT sesiones INTO @c FROM bienes_actividades WHERE id=idact;
	RETURN @c;
    END */$$
DELIMITER ;

/* Function  structure for function  `getInscritos` */

/*!50003 DROP FUNCTION IF EXISTS `getInscritos` */;
DELIMITER $$

/*!50003 CREATE DEFINER=`josue.rivera`@`%` FUNCTION `getInscritos`(id INT) RETURNS varchar(64) CHARSET utf8
    DETERMINISTIC
BEGIN
	SET @c = '0';
	SELECT DISTINCT COUNT(*) INTO @c FROM bienes_actividades_participantes WHERE id_actividad=id GROUP BY item;
	RETURN @c;
	
    END */$$
DELIMITER ;

/* Function  structure for function  `getEstadoActiParticipante` */

/*!50003 DROP FUNCTION IF EXISTS `getEstadoActiParticipante` */;
DELIMITER $$

/*!50003 CREATE DEFINER=`josue.rivera`@`%` FUNCTION `getEstadoActiParticipante`(id INT) RETURNS varchar(1024) CHARSET utf8
    DETERMINISTIC
BEGIN
	SET @c = '';
	SELECT nomb_estado INTO @c FROM bienes_actividades_participantes_estado WHERE cod_estado=id;
	RETURN @c;
    END */$$
DELIMITER ;

/* Function  structure for function  `getLealtad` */

/*!50003 DROP FUNCTION IF EXISTS `getLealtad` */;
DELIMITER $$

/*!50003 CREATE DEFINER=`josue.rivera`@`%` FUNCTION `getLealtad`(points INT) RETURNS varchar(128) CHARSET utf8
    DETERMINISTIC
BEGIN
	SET @c = '';
	SELECT l.name INTO @c FROM bienes_lealtad as l WHERE points between l.min_point and l.max_point;
	RETURN @c;
    END */$$
DELIMITER ;

/* Function  structure for function  `getAprobacionBienesParticipante` */

/*!50003 DROP FUNCTION IF EXISTS `getAprobacionBienesParticipante` */;
DELIMITER $$

/*!50003 CREATE DEFINER=`josue.rivera`@`%` FUNCTION `getAprobacionBienesParticipante`(dni VARCHAR(64)) RETURNS varchar(2048) CHARSET utf8
    DETERMINISTIC
BEGIN
	SET @c = '';
	 SELECT  JSON_OBJECT('id_aproba', id_aproba, 'id_creador', id_creador,'name_creador',getAdminName(id_creador),'periodo', periodo_aproba,'obser_aproba',obser_aproba,'tipo_aprob',getAprobacionTipo(id_tapro), 'marc_temp', marc_temp, 'marc_update', marc_update) INTO @c
		FROM bienes_aprobaciones_participantes WHERE dni_part=dni AND anulado='0';

	
	RETURN @c;
    END */$$
DELIMITER ;

/* Function  structure for function  `getEvalActividad` */

/*!50003 DROP FUNCTION IF EXISTS `getEvalActividad` */;
DELIMITER $$

/*!50003 CREATE DEFINER=`josue.rivera`@`%` FUNCTION `getEvalActividad`(idact INT, dni varchar(64)) RETURNS int
    DETERMINISTIC
BEGIN
		SET @c = 0;
		SELECT califica INTO @c FROM bienes_actividades_participantes_calificacion WHERE id_acti=idact and dni_part=dni ;
		RETURN @c;
	END */$$
DELIMITER ;

/* Function  structure for function  `esDocenteActividad` */

/*!50003 DROP FUNCTION IF EXISTS `esDocenteActividad` */;
DELIMITER $$

/*!50003 CREATE DEFINER=`josue.rivera`@`%` FUNCTION `esDocenteActividad`(idact INT, dnidoc VARCHAR(30)) RETURNS tinyint
    DETERMINISTIC
BEGIN
	SET @c = 0;
	SET @r = FALSE;
	SELECT COUNT(dni_docente) INTO @c FROM bienes_actividades WHERE id=idact AND dni_docente=dnidoc;
	IF(@c > 0) THEN
		SET @r = TRUE;
	END IF;
	RETURN @r;
    END */$$
DELIMITER ;

/* Function  structure for function  `getRegistroAsistenciaActividad` */

/*!50003 DROP FUNCTION IF EXISTS `getRegistroAsistenciaActividad` */;
DELIMITER $$

/*!50003 CREATE DEFINER=`josue.rivera`@`%` FUNCTION `getRegistroAsistenciaActividad`(idact INT, itm int) RETURNS varchar(32) CHARSET utf8
    DETERMINISTIC
BEGIN
	SET @c = '';
	SELECT DISTINCT IF(dni_docente IS NULL,0,1) into @c FROM bienes_actividades_participantes WHERE id_actividad=idact AND item =itm LIMIT 1;
	RETURN @c;
    END */$$
DELIMITER ;

/* Function  structure for function  `getSesionProxima` */

/*!50003 DROP FUNCTION IF EXISTS `getSesionProxima` */;
DELIMITER $$

/*!50003 CREATE DEFINER=`josue.rivera`@`%` FUNCTION `getSesionProxima`(idact INT) RETURNS varchar(64) CHARSET utf8
    DETERMINISTIC
BEGIN
    SET @c = '';
	SELECT CONCAT(fecha,' ',hora_ini) INTO @c FROM bienes_actividades_horarios WHERE id_actividad=idact  AND UNIX_TIMESTAMP(SYSDATE()) <= ROUND(UNIX_TIMESTAMP(CONCAT(fecha,' ',hora_ini))) ORDER BY 1 ASC LIMIT 1;
    RETURN @c;
    END */$$
DELIMITER ;

/* Function  structure for function  `esRolAdmin` */

/*!50003 DROP FUNCTION IF EXISTS `esRolAdmin` */;
DELIMITER $$

/*!50003 CREATE DEFINER=`josue.rivera`@`%` FUNCTION `esRolAdmin`(rol int ,dni VARCHAR(30)) RETURNS tinyint
    DETERMINISTIC
BEGIN
	SET @c = 0;
	SET @r = FALSE;
	SELECT COUNT(dni_admin) INTO @c FROM bienes_admin WHERE idTipo=rol AND dni_admin=dni;
	IF(@c > 0) THEN
		SET @r = TRUE;
	END IF;
	RETURN @r;
    END */$$
DELIMITER ;

/* Function  structure for function  `getAdminEmail` */

/*!50003 DROP FUNCTION IF EXISTS `getAdminEmail` */;
DELIMITER $$

/*!50003 CREATE DEFINER=`josue.rivera`@`%` FUNCTION `getAdminEmail`(dni INT) RETURNS varchar(1024) CHARSET utf8
    DETERMINISTIC
BEGIN
	SET @c = '';
	SELECT email_admin INTO @c FROM bienes_admin WHERE dni_admin=dni limit 1;
	RETURN @c;
END */$$
DELIMITER ;

/* Function  structure for function  `getCuposActividad` */

/*!50003 DROP FUNCTION IF EXISTS `getCuposActividad` */;
DELIMITER $$

/*!50003 CREATE DEFINER=`josue.rivera`@`%` FUNCTION `getCuposActividad`(idact INT) RETURNS varchar(64) CHARSET utf8
    DETERMINISTIC
BEGIN
	SET @c = '0';
	SELECT cupos INTO @c FROM bienes_actividades WHERE id=idact;
	RETURN @c;
	
    END */$$
DELIMITER ;

/* Function  structure for function  `tieneCuposDisponibles` */

/*!50003 DROP FUNCTION IF EXISTS `tieneCuposDisponibles` */;
DELIMITER $$

/*!50003 CREATE DEFINER=`josue.rivera`@`%` FUNCTION `tieneCuposDisponibles`(id INT) RETURNS tinyint(1)
    DETERMINISTIC
BEGIN
        SET @r = false;	
	SET @i = 0;
	SEt @c = 0;
	SELECT convert(getInscritos(id),unsigned integer) INTO @i;
	SELECT convert(getCuposActividad(id), unsigned integer) INTO @c;
	if (@c>@i) then
		set @r = true;
	
	end if;
	
	RETURN @r;
	
    END */$$
DELIMITER ;

/* Function  structure for function  `tieneAprobaciones` */

/*!50003 DROP FUNCTION IF EXISTS `tieneAprobaciones` */;
DELIMITER $$

/*!50003 CREATE DEFINER=`josue.rivera`@`%` FUNCTION `tieneAprobaciones`(idact INT) RETURNS tinyint(1)
    DETERMINISTIC
BEGIN
        SET @r = FALSE;	
	
	SET @c = 0;
	SELECT COUNT(id_aproba) into @c FROM bienes_aprobaciones_actividades WHERE id_actividad=idact;

	IF (@c>0) THEN
		SET @r = TRUE;
	
	END IF;
	
	RETURN @r;
	
    END */$$
DELIMITER ;

/* Function  structure for function  `getAdminRoleName` */

/*!50003 DROP FUNCTION IF EXISTS `getAdminRoleName` */;
DELIMITER $$

/*!50003 CREATE DEFINER=`josue.rivera`@`%` FUNCTION `getAdminRoleName`(idtipo INT) RETURNS varchar(1024) CHARSET utf8
    DETERMINISTIC
BEGIN
	SET @c = '';
	SELECT tipo INTO @c FROM bienes_admin_tipo WHERE id=idtipo;
	RETURN @c;
END */$$
DELIMITER ;

/* Function  structure for function  `getPointsSaldo` */

/*!50003 DROP FUNCTION IF EXISTS `getPointsSaldo` */;
DELIMITER $$

/*!50003 CREATE DEFINER=`josue.rivera`@`%` FUNCTION `getPointsSaldo`(dni varchar(64)) RETURNS varchar(128) CHARSET utf8
    DETERMINISTIC
BEGIN
	SET @c = '0';
	SELECT SUM(monto) into @c FROM bienes_lealtad_transacciones WHERE idEstado='2' AND dni_part=dni;
	if (@c is null) then
	SET @c= '0';
	END IF;
	RETURN @c;
    END */$$
DELIMITER ;

/* Function  structure for function  `getEstadoActiParticipanteCount` */

/*!50003 DROP FUNCTION IF EXISTS `getEstadoActiParticipanteCount` */;
DELIMITER $$

/*!50003 CREATE DEFINER=`josue.rivera`@`%` FUNCTION `getEstadoActiParticipanteCount`(id INT,est int, dni varchar(30)) RETURNS int
    DETERMINISTIC
BEGIN
	SET @c = 0;
	SELECT COUNT(vp.dni_part) into @c FROM v_participantes AS vp WHERE vp.dni_part=dni AND vp.estado=est AND vp.id_actividad=id;
	RETURN @c;
    END */$$
DELIMITER ;

/* Function  structure for function  `getHorasAprobacion` */

/*!50003 DROP FUNCTION IF EXISTS `getHorasAprobacion` */;
DELIMITER $$

/*!50003 CREATE DEFINER=`josue.rivera`@`%` FUNCTION `getHorasAprobacion`() RETURNS time
    DETERMINISTIC
BEGIN
	SET @c = '00:00:00';
	SELECT convert(valor_conf,TIME) INTO @c FROM bienes_config WHERE nomb_conf='horas_aprobacion';
	RETURN @c;
 

    END */$$
DELIMITER ;

/* Function  structure for function  `tieneAprobacionesParticipante` */

/*!50003 DROP FUNCTION IF EXISTS `tieneAprobacionesParticipante` */;
DELIMITER $$

/*!50003 CREATE DEFINER=`josue.rivera`@`%` FUNCTION `tieneAprobacionesParticipante`(dnipart varchar(30)) RETURNS tinyint(1)
    DETERMINISTIC
BEGIN
        SET @r = FALSE;	
	
	SET @c = 0;
	SELECT COUNT(id_aproba) INTO @c FROM bienes_aprobaciones_participantes WHERE dni_part=dnipart and anulado='0';

	IF (@c>0) THEN
		SET @r = TRUE;
	
	END IF;
	
	RETURN @r;
	
    END */$$
DELIMITER ;

/* Function  structure for function  `tieneAprobacionesParticipanteActividad` */

/*!50003 DROP FUNCTION IF EXISTS `tieneAprobacionesParticipanteActividad` */;
DELIMITER $$

/*!50003 CREATE DEFINER=`josue.rivera`@`%` FUNCTION `tieneAprobacionesParticipanteActividad`(dnipart VARCHAR(30), id int) RETURNS tinyint(1)
    DETERMINISTIC
BEGIN
        SET @r = FALSE;	
	
	SET @c = 0;
	SELECT COUNT(id_aproba) INTO @c FROM bienes_aprobaciones_actividades WHERE dni_part=dnipart and id_actividad=id and aprobado is true  AND anulado='0';

	IF (@c>0) THEN
		SET @r = TRUE;
	
	END IF;
	
	RETURN @r;
	
    END */$$
DELIMITER ;

/* Function  structure for function  `getActividadName` */

/*!50003 DROP FUNCTION IF EXISTS `getActividadName` */;
DELIMITER $$

/*!50003 CREATE DEFINER=`josue.rivera`@`%` FUNCTION `getActividadName`(idact INT) RETURNS varchar(64) CHARSET utf8
    DETERMINISTIC
BEGIN
	SET @c = '';
	SELECT nomb_acti INTO @c FROM bienes_actividades WHERE id=idact;
	RETURN @c;
    END */$$
DELIMITER ;

/* Function  structure for function  `getFechaInicioSesion` */

/*!50003 DROP FUNCTION IF EXISTS `getFechaInicioSesion` */;
DELIMITER $$

/*!50003 CREATE DEFINER=`josue.rivera`@`%` FUNCTION `getFechaInicioSesion`(idact INT, ses int) RETURNS varchar(64) CHARSET utf8
    DETERMINISTIC
BEGIN
	SET @c = '';
	SELECT CONCAT(fecha,' ',hora_ini) INTO @c FROM bienes_actividades_horarios WHERE id_actividad=idact and item=ses;
	RETURN @c; 
    END */$$
DELIMITER ;

/* Function  structure for function  `esCertificable` */

/*!50003 DROP FUNCTION IF EXISTS `esCertificable` */;
DELIMITER $$

/*!50003 CREATE DEFINER=`josue.rivera`@`%` FUNCTION `esCertificable`(idact INT) RETURNS tinyint
    DETERMINISTIC
BEGIN
	
	SET @r = FALSE;
	SELECT t.certifica into @r FROM bienes_actividades AS a INNER JOIN bienes_aprobaciones_tipo AS t ON a.tipo_aprob=t.id_tapro WHERE id=idact;
	
	RETURN @r;
    END */$$
DELIMITER ;

/* Function  structure for function  `getAdrressEth` */

/*!50003 DROP FUNCTION IF EXISTS `getAdrressEth` */;
DELIMITER $$

/*!50003 CREATE DEFINER=`josue.rivera`@`%` FUNCTION `getAdrressEth`(dni varchar(30)) RETURNS varchar(1024) CHARSET utf8
    DETERMINISTIC
BEGIN
	SET @c = '';
	SELECT address INTO @c FROM bienes_participantes WHERE dni_part=dni;
	if (@c is null) then
	SET @c = '';
	end if;
	RETURN @c;
END */$$
DELIMITER ;

/* Function  structure for function  `getAprobacionNameActividad` */

/*!50003 DROP FUNCTION IF EXISTS `getAprobacionNameActividad` */;
DELIMITER $$

/*!50003 CREATE DEFINER=`josue.rivera`@`%` FUNCTION `getAprobacionNameActividad`(idaprob INT) RETURNS varchar(2048) CHARSET utf8
    DETERMINISTIC
BEGIN
	SET @c = null;
	 SELECT CONCAT(ac.nomb_acti,' [',  LPAD(ac.id,5,'0'), ']' ) into @c FROM bienes_aprobaciones_actividades AS aa, bienes_actividades AS ac WHERE aa.id_actividad=ac.id AND aa.id_aproba=idaprob;
	RETURN @c;
    END */$$
DELIMITER ;

/* Function  structure for function  `getRedencionPärt` */

/*!50003 DROP FUNCTION IF EXISTS `getRedencionPärt` */;
DELIMITER $$

/*!50003 CREATE DEFINER=`josue.rivera`@`%` FUNCTION `getRedencionPärt`(dnipart varchar(30), idreden INT) RETURNS varchar(2048) CHARSET utf8
    DETERMINISTIC
BEGIN
	SET @c = NULL;
	 
		SELECT CONCAT(concepto,' [',  LPAD(id_reden,5,'0'), ']' ) into @c FROM bienes_redenciones WHERE dni_part=dnipart AND id_reden=idreden and anulado='0';
	RETURN @c;
    END */$$
DELIMITER ;

/* Function  structure for function  `getParticipanteName` */

/*!50003 DROP FUNCTION IF EXISTS `getParticipanteName` */;
DELIMITER $$

/*!50003 CREATE DEFINER=`josue.rivera`@`%` FUNCTION `getParticipanteName`(dni varchar(30)) RETURNS varchar(1024) CHARSET utf8
    DETERMINISTIC
BEGIN
	SET @c = '';
	SELECT CONCAT(nomb_part, ' ',apel_part) INTO @c FROM bienes_participantes WHERE dni_part=dni;
	RETURN @c;
END */$$
DELIMITER ;

/* Function  structure for function  `getParticipanteEmail` */

/*!50003 DROP FUNCTION IF EXISTS `getParticipanteEmail` */;
DELIMITER $$

/*!50003 CREATE DEFINER=`josue.rivera`@`%` FUNCTION `getParticipanteEmail`(dni VARCHAR(30)) RETURNS varchar(1024) CHARSET utf8
    DETERMINISTIC
BEGIN
	SET @c = '';
	SELECT email_part INTO @c FROM bienes_participantes WHERE dni_part=dni;
	RETURN @c;
END */$$
DELIMITER ;

/* Function  structure for function  `getCertificate` */

/*!50003 DROP FUNCTION IF EXISTS `getCertificate` */;
DELIMITER $$

/*!50003 CREATE DEFINER=`josue.rivera`@`%` FUNCTION `getCertificate`(idap INT) RETURNS varchar(1024) CHARSET utf8 COLLATE utf8_unicode_ci
    DETERMINISTIC
BEGIN
		SET @c = '';
		SELECT file INTO @c FROM bienes_aprobaciones_certificados WHERE id_aproba=idap;
		RETURN @c;
	END */$$
DELIMITER ;

/* Function  structure for function  `getCertificateEstaProtegido` */

/*!50003 DROP FUNCTION IF EXISTS `getCertificateEstaProtegido` */;
DELIMITER $$

/*!50003 CREATE DEFINER=`josue.rivera`@`%` FUNCTION `getCertificateEstaProtegido`(idap INT) RETURNS tinyint
    DETERMINISTIC
BEGIN
	
	SET @r = FALSE;
	SELECT if(eth_transact is null, false,true) INTO @r FROM bienes_aprobaciones_certificados WHERE id_aproba=idap;
	
	RETURN @r;
    END */$$
DELIMITER ;

/* Function  structure for function  `getAprobacionActParticipante` */

/*!50003 DROP FUNCTION IF EXISTS `getAprobacionActParticipante` */;
DELIMITER $$

/*!50003 CREATE DEFINER=`josue.rivera`@`%` FUNCTION `getAprobacionActParticipante`(id INT,dni varchar(64)) RETURNS varchar(2048) CHARSET utf8
    DETERMINISTIC
BEGIN
	SET @c = '';
	 SELECT  JSON_OBJECT('id_aproba', id_aproba, 'id_creador', id_creador,'name_creador',getAdminName(id_creador),'aprobado', aprobado, 'marc_temp', marc_temp, 'marc_update', marc_update,'file',getCertificate(id_aproba),'protegido',getCertificateEstaProtegido(id_aproba)) into @c
		FROM bienes_aprobaciones_actividades WHERE id_actividad =id AND dni_part=dni AND anulado='0';

	
	RETURN @c;
    END */$$
DELIMITER ;

/* Function  structure for function  `getSesionesCount` */

/*!50003 DROP FUNCTION IF EXISTS `getSesionesCount` */;
DELIMITER $$

/*!50003 CREATE DEFINER=`josue.rivera`@`%` FUNCTION `getSesionesCount`(idact INT) RETURNS int
    DETERMINISTIC
BEGIN
	SET @c = 0;
	SELECT count(item) INTO @c FROM bienes_actividades_horarios WHERE id_actividad=idact AND eliminado='0';
	RETURN @c;
    END */$$
DELIMITER ;

/* Function  structure for function  `esAdminActivo` */

/*!50003 DROP FUNCTION IF EXISTS `esAdminActivo` */;
DELIMITER $$

/*!50003 CREATE DEFINER=`josue.rivera`@`%` FUNCTION `esAdminActivo`(dni VARCHAR(30)) RETURNS tinyint
    DETERMINISTIC
BEGIN
	
	SET @r = FALSE;
	SELECT enabled INTO @r FROM bienes_admin WHERE dni_admin=dni;
	
	RETURN @r;
    END */$$
DELIMITER ;

/* Function  structure for function  `getAdminEnabled` */

/*!50003 DROP FUNCTION IF EXISTS `getAdminEnabled` */;
DELIMITER $$

/*!50003 CREATE DEFINER=`josue.rivera`@`%` FUNCTION `getAdminEnabled`(dni INT) RETURNS tinyint
    DETERMINISTIC
BEGIN
	SET @c = false;
	SELECT enabled INTO @c FROM bienes_admin WHERE dni_admin=dni limit 1;
	RETURN @c;
END */$$
DELIMITER ;

/* Function  structure for function  `getAdminName` */

/*!50003 DROP FUNCTION IF EXISTS `getAdminName` */;
DELIMITER $$

/*!50003 CREATE DEFINER=`josue.rivera`@`%` FUNCTION `getAdminName`(dni int) RETURNS varchar(1024) CHARSET utf8
    DETERMINISTIC
BEGIN
	SET @c = '';
	SELECT concat(nomb_admin, ' ',apel_admin) as nombre INTO @c FROM bienes_admin WHERE dni_admin=dni limit 1;
	RETURN @c;
END */$$
DELIMITER ;

/* Function  structure for function  `getHorasAcumParticipante` */

/*!50003 DROP FUNCTION IF EXISTS `getHorasAcumParticipante` */;
DELIMITER $$

/*!50003 CREATE DEFINER=`josue.rivera`@`%` FUNCTION `getHorasAcumParticipante`(dni varchar(64)) RETURNS time
    DETERMINISTIC
BEGIN
	SET @c = '00:00:00';
	SELECT SEC_TO_TIME(SUM(TIME_TO_SEC(horas))) INTO @c FROM bienes_actividades_participantes WHERE id_participante=dni and horas is not null;
	RETURN @c;
 

END */$$
DELIMITER ;

/* Function  structure for function  `getAprobacionTipoDesc` */

/*!50003 DROP FUNCTION IF EXISTS `getAprobacionTipoDesc` */;
DELIMITER $$

/*!50003 CREATE DEFINER=`josue.rivera`@`%` FUNCTION `getAprobacionTipoDesc`(id INT) RETURNS varchar(4096) CHARSET utf8
    DETERMINISTIC
BEGIN
	SET @c = '';
	SELECT desc_aprob INTO @c FROM bienes_aprobaciones_tipo WHERE id_tapro=id;
	RETURN @c;
    END */$$
DELIMITER ;

/* Function  structure for function  `getAprobacionTipo` */

/*!50003 DROP FUNCTION IF EXISTS `getAprobacionTipo` */;
DELIMITER $$

/*!50003 CREATE DEFINER=`josue.rivera`@`%` FUNCTION `getAprobacionTipo`(id INT) RETURNS varchar(512) CHARSET utf8
    DETERMINISTIC
BEGIN
	SET @c = '';
	SELECT nomb_tapro INTO @c FROM bienes_aprobaciones_tipo WHERE id_tapro=id;
	RETURN @c;
    END */$$
DELIMITER ;

/* Function  structure for function  `getHorasAcumActividadParticipante` */

/*!50003 DROP FUNCTION IF EXISTS `getHorasAcumActividadParticipante` */;
DELIMITER $$

/*!50003 CREATE DEFINER=`josue.rivera`@`%` FUNCTION `getHorasAcumActividadParticipante`(idact int,dni VARCHAR(64)) RETURNS time
    DETERMINISTIC
BEGIN
	SET @c = '00:00:00';
	SELECT SEC_TO_TIME(SUM(TIME_TO_SEC(horas))) INTO @c FROM bienes_actividades_participantes WHERE id_participante=dni and id_actividad=idact;
	RETURN @c;
 

    END */$$
DELIMITER ;

/* Function  structure for function  `getPrograma` */

/*!50003 DROP FUNCTION IF EXISTS `getPrograma` */;
DELIMITER $$

/*!50003 CREATE DEFINER=`josue.rivera`@`%` FUNCTION `getPrograma`(id INT) RETURNS varchar(256) CHARSET utf8
    DETERMINISTIC
BEGIN
	SET @c = '';
	SELECT nomb_prog INTO @c FROM bienes_programas WHERE codi_prog=id;
	RETURN @c;
    END */$$
DELIMITER ;

/* Function  structure for function  `getAprobacionActParticipanteCertificado` */

/*!50003 DROP FUNCTION IF EXISTS `getAprobacionActParticipanteCertificado` */;
DELIMITER $$

/*!50003 CREATE DEFINER=`josue.rivera`@`%` FUNCTION `getAprobacionActParticipanteCertificado`(id INT,dni VARCHAR(64)) RETURNS tinyint
    DETERMINISTIC
BEGIN
	SET @c = false;
	 SELECT  if(getCertificate(id_aproba) is not null,true,false) INTO @c
		FROM bienes_aprobaciones_actividades WHERE id_actividad =id AND dni_part=dni AND anulado='0' order by id_aproba desc limit 1;

	RETURN @c;
    END */$$
DELIMITER ;

/* Function  structure for function  `esAprobableXqr` */

/*!50003 DROP FUNCTION IF EXISTS `esAprobableXqr` */;
DELIMITER $$

/*!50003 CREATE DEFINER=`josue.rivera`@`%` FUNCTION `esAprobableXqr`(id INT, it INT) RETURNS tinyint
    DETERMINISTIC
BEGIN
	SET @c = 0;
	
	SET @r = FALSE;
	SELECT count(fecha) INTO @c FROM bienes_actividades_horarios WHERE id_actividad=id and item=it AND ADDTIME(CONCAT(fecha, ' ' ,hora_fin),'2:00:00') >= NOW();
	
	IF(@c > 0) THEN
		SET @r = TRUE;
	END IF;
	RETURN @r;
    END */$$
DELIMITER ;

/* Function  structure for function  `getHorasActividad` */

/*!50003 DROP FUNCTION IF EXISTS `getHorasActividad` */;
DELIMITER $$

/*!50003 CREATE DEFINER=`josue.rivera`@`%` FUNCTION `getHorasActividad`(idact INT) RETURNS varchar(32) CHARSET utf8 COLLATE utf8_unicode_ci
    DETERMINISTIC
BEGIN
	set @h= null;
	select CONVERT(horas_cert,CHAR) into @h from bienes_actividades where id=idact;
	
	if ((@h is null) or (@h ='00:00:00')) then

	
		SET @c = '00:00:00';
		SELECT CONVERT(SEC_TO_TIME(SUM(TIME_TO_SEC(TIMEDIFF(hora_fin,hora_ini)))),CHAR) INTO @c FROM bienes_actividades_horarios WHERE id_actividad=idact and eliminado='0' ;
		RETURN @c;
		
	else
		return @h;
	end if;
 

    END */$$
DELIMITER ;

/* Function  structure for function  `getFechaFinActividad` */

/*!50003 DROP FUNCTION IF EXISTS `getFechaFinActividad` */;
DELIMITER $$

/*!50003 CREATE DEFINER=`josue.rivera`@`%` FUNCTION `getFechaFinActividad`(id INT) RETURNS varchar(64) CHARSET utf8
    DETERMINISTIC
BEGIN
	SET @c = '';
	SELECT CONCAT(fecha,' ',hora_fin) INTO @c FROM bienes_actividades_horarios WHERE id_actividad=id and eliminado=0 order by fecha desc, hora_fin desc limit 1 ;
	RETURN @c; 
    END */$$
DELIMITER ;

/* Function  structure for function  `getFechaInicioActividad` */

/*!50003 DROP FUNCTION IF EXISTS `getFechaInicioActividad` */;
DELIMITER $$

/*!50003 CREATE DEFINER=`josue.rivera`@`%` FUNCTION `getFechaInicioActividad`(id INT) RETURNS varchar(64) CHARSET utf8
    DETERMINISTIC
BEGIN
	SET @c = '';
	SELECT CONCAT(fecha,' ',hora_ini) into @c FROM bienes_actividades_horarios WHERE id_actividad=id and eliminado=0 ORDER BY fecha ASC,hora_ini asc limit 1;
	RETURN @c; 
    END */$$
DELIMITER ;

/* Procedure structure for procedure `AprobarBienestarHAcum` */

/*!50003 DROP PROCEDURE IF EXISTS  `AprobarBienestarHAcum` */;

DELIMITER $$

/*!50003 CREATE DEFINER=`josue.rivera`@`%` PROCEDURE `AprobarBienestarHAcum`(creador varchar(30))
BEGIN
		
		DECLARE done INT DEFAULT FALSE;
		
		DECLARE dnipart VARCHAR(30);		
		DECLARE hac time;
		
		DECLARE partaprob CURSOR FOR
			SELECT dni_part,hacum FROM v_participantes_hacum WHERE hacum >=getHorasAprobacion() and tieneAprobacionesParticipante(dni_part) is false;		
		DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;
		
		OPEN partaprob;
		read_loop: LOOP
		
			FETCH partaprob INTO dnipart,hac;
			IF done THEN
				LEAVE read_loop;
			
			END IF;
				
				INSERT INTO bienes_aprobaciones_participantes (dni_part,id_tapro,obser_aproba,periodo_aproba,id_creador) VALUES 
				(dnipart,'5','Aprobación automática por cumplimiento de horas mínimas',periodoActivo(),creador);
						
			
                END LOOP;
                CLOSE partaprob;
		
		
		
	END */$$
DELIMITER ;

/* Procedure structure for procedure `AprobarActividadPorcent` */

/*!50003 DROP PROCEDURE IF EXISTS  `AprobarActividadPorcent` */;

DELIMITER $$

/*!50003 CREATE DEFINER=`josue.rivera`@`%` PROCEDURE `AprobarActividadPorcent`(idact int, dnidoc varchar(30))
BEGIN
		DECLARE done INT DEFAULT FALSE;
		DECLARE dnipart varchar(30);
		declare aprob INT(11);
		DECLARE reg int(11);
		DECLARE aproreg INT(11);	
		DECLARE partaprob CURSOR FOR  	
				SELECT DISTINCT acti.id_participante,
	IF(CAST(((IFNULL(TIME_TO_SEC(getHorasAcumActividadParticipante(acti.id_actividad,acti.id_participante)),0)/ TIME_TO_SEC(`getHorasActividad`(acti.id_actividad)))*100) AS UNSIGNED) >= CAST((SELECT valor_conf FROM bienes_config WHERE nomb_conf='porcent_aprobacion') AS UNSIGNED),1,0) AS aprobado
	,IF((SELECT a.id_aproba FROM bienes_aprobaciones_actividades AS a WHERE a.id_actividad=acti.id_actividad AND a.dni_part=acti.id_participante AND a.anulado='0') IS NULL,0,1) AS registrado				
	,(SELECT b.aprobado FROM bienes_aprobaciones_actividades AS b WHERE b.id_actividad=acti.id_actividad AND b.dni_part=acti.id_participante) AS aprobareg 	 
		FROM bienes_actividades_participantes AS acti WHERE acti.id_actividad=idact;
		DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;
		
		OPEN partaprob;
		read_loop: LOOP
		
			FETCH partaprob INTO dnipart,aprob,reg,aproreg;
			IF done THEN
				LEAVE read_loop;
			END IF;
			if (reg=0) then		
				iNSERT INTO bienes_aprobaciones_actividades (id_actividad,dni_part,id_creador,aprobado) VALUES (idact,dnipart,dnidoc,aprob);
			else
				IF (aprob <> aproreg) THEN
			
				UPDATE bienes_aprobaciones_actividades SET anulado='1' WHERE id_actividad=idact AND dni_part=dnipart AND anulado='0';
				INSERT ignore INTO bienes_aprobaciones_actividades (id_actividad,dni_part,id_creador,aprobado) VALUES (idact,dnipart,dnidoc,aprob);
				END IF;
						
			end if;
			
                END LOOP;
                CLOSE partaprob;
		select * from `bienes_aprobaciones_actividades` where id_actividad=idact and anulado='0';
	END */$$
DELIMITER ;

/*Table structure for table `v_actividades_ofertadas` */

DROP TABLE IF EXISTS `v_actividades_ofertadas`;

/*!50001 DROP VIEW IF EXISTS `v_actividades_ofertadas` */;
/*!50001 DROP TABLE IF EXISTS `v_actividades_ofertadas` */;

/*!50001 CREATE TABLE  `v_actividades_ofertadas`(
 `id` bigint ,
 `nomb_acti` varchar(250) ,
 `descripcion` text ,
 `categoria` varchar(64) ,
 `sesiones` int ,
 `cupos` int ,
 `id_depart` int ,
 `depart` varchar(64) ,
 `puntos` varchar(64) ,
 `tipo_aprob` varchar(512) ,
 `tipo_aprob_desc` text ,
 `periodo` varchar(10) ,
 `inicio` varchar(64) ,
 `fin` varchar(64) ,
 `oferta_programa` varchar(128) ,
 `oferta_programahum` text ,
 `oferta_rol` varchar(128) ,
 `oferta_rolhum` text ,
 `inscritos` varchar(64) ,
 `horas_cert` varchar(10) 
)*/;

/*Table structure for table `v_transac` */

DROP TABLE IF EXISTS `v_transac`;

/*!50001 DROP VIEW IF EXISTS `v_transac` */;
/*!50001 DROP TABLE IF EXISTS `v_transac` */;

/*!50001 CREATE TABLE  `v_transac`(
 `id_transac` bigint ,
 `dni_part` varchar(30) ,
 `marc_update` datetime ,
 `monto` decimal(10,0) ,
 `tipo_transac` varchar(64) ,
 `estado` varchar(64) ,
 `detalle` text ,
 `eth_transact` varchar(512) 
)*/;

/*Table structure for table `v_participantes` */

DROP TABLE IF EXISTS `v_participantes`;

/*!50001 DROP VIEW IF EXISTS `v_participantes` */;
/*!50001 DROP TABLE IF EXISTS `v_participantes` */;

/*!50001 CREATE TABLE  `v_participantes`(
 `dni_part` varchar(30) ,
 `nomb_part` varchar(128) ,
 `apel_part` varchar(128) ,
 `email_part` varchar(128) ,
 `id_actividad` bigint ,
 `item` int ,
 `estado` int ,
 `observacion` varchar(256) ,
 `dni_docente` varchar(30) ,
 `marc_update` datetime ,
 `horas` time ,
 `programa` varchar(256) 
)*/;

/*Table structure for table `v_participantes_hacum` */

DROP TABLE IF EXISTS `v_participantes_hacum`;

/*!50001 DROP VIEW IF EXISTS `v_participantes_hacum` */;
/*!50001 DROP TABLE IF EXISTS `v_participantes_hacum` */;

/*!50001 CREATE TABLE  `v_participantes_hacum`(
 `dni_part` varchar(30) ,
 `hacum` time 
)*/;

/*Table structure for table `v_actividades` */

DROP TABLE IF EXISTS `v_actividades`;

/*!50001 DROP VIEW IF EXISTS `v_actividades` */;
/*!50001 DROP TABLE IF EXISTS `v_actividades` */;

/*!50001 CREATE TABLE  `v_actividades`(
 `id` bigint ,
 `nomb_acti` varchar(250) ,
 `periodo` varchar(10) ,
 `descripcion` text ,
 `sesiones` int ,
 `cupos` int ,
 `idcateg` int ,
 `categoria` varchar(64) ,
 `id_depart` int ,
 `depart` varchar(64) ,
 `fecha_inicio` varchar(64) ,
 `fecha_fin` varchar(64) ,
 `idBonus` int ,
 `puntos` varchar(64) ,
 `idtipo_aprob` int ,
 `tipo_aprob` varchar(512) ,
 `tipo_aprob_desc` text ,
 `oferta_programa` varchar(128) ,
 `oferta_programahum` text ,
 `oferta_rol` varchar(128) ,
 `oferta_rolhum` text ,
 `dni_docente` varchar(30) ,
 `docente` text ,
 `certificable` tinyint ,
 `tienecupos` tinyint(1) ,
 `tieneaprobaciones` tinyint(1) ,
 `inscritos` varchar(64) ,
 `horas_cert` varchar(10) 
)*/;

/*Table structure for table `v_actividades_categ_horas` */

DROP TABLE IF EXISTS `v_actividades_categ_horas`;

/*!50001 DROP VIEW IF EXISTS `v_actividades_categ_horas` */;
/*!50001 DROP TABLE IF EXISTS `v_actividades_categ_horas` */;

/*!50001 CREATE TABLE  `v_actividades_categ_horas`(
 `id` bigint ,
 `nomb_acti` varchar(250) ,
 `categ` varchar(64) ,
 `horas` varchar(32) ,
 `periodo` varchar(10) ,
 `categoria` int 
)*/;

/*Table structure for table `v_aprobados_cualificacion` */

DROP TABLE IF EXISTS `v_aprobados_cualificacion`;

/*!50001 DROP VIEW IF EXISTS `v_aprobados_cualificacion` */;
/*!50001 DROP TABLE IF EXISTS `v_aprobados_cualificacion` */;

/*!50001 CREATE TABLE  `v_aprobados_cualificacion`(
 `ID_ACTIVIDAD` bigint ,
 `ACTIVIDAD` varchar(250) ,
 `HORAS` varchar(32) ,
 `DNI_PARTICIPANTE` varchar(30) ,
 `FECHA_APROBACION` datetime ,
 `PERIODO` varchar(10) ,
 `CATEGORIA` varchar(64) ,
 `ID_CATEGORIA` int 
)*/;

/*View structure for view v_actividades_ofertadas */

/*!50001 DROP TABLE IF EXISTS `v_actividades_ofertadas` */;
/*!50001 DROP VIEW IF EXISTS `v_actividades_ofertadas` */;

/*!50001 CREATE ALGORITHM=UNDEFINED DEFINER=`josue.rivera`@`%` SQL SECURITY DEFINER VIEW `v_actividades_ofertadas` AS select `a`.`id` AS `id`,`a`.`nomb_acti` AS `nomb_acti`,`a`.`descripcion` AS `descripcion`,`getCategoriaActividad`(`a`.`categoria`) AS `categoria`,`a`.`sesiones` AS `sesiones`,`a`.`cupos` AS `cupos`,`a`.`id_depart` AS `id_depart`,`getDepartamento`(`a`.`id_depart`) AS `depart`,`getPointsBonus`(`a`.`idBonus`) AS `puntos`,`getAprobacionTipo`(`a`.`tipo_aprob`) AS `tipo_aprob`,`getAprobacionTipoDesc`(`a`.`tipo_aprob`) AS `tipo_aprob_desc`,`a`.`periodo` AS `periodo`,`getFechaInicioActividad`(`a`.`id`) AS `inicio`,`getFechaFinActividad`(`a`.`id`) AS `fin`,`getProgramaOfertaActividad`(`a`.`id`) AS `oferta_programa`,`getProgramaNameOfertaActividad`(`a`.`id`) AS `oferta_programahum`,`getRoleOfertaActividad`(`a`.`id`) AS `oferta_rol`,`getRoleNameOfertaActividad`(`a`.`id`) AS `oferta_rolhum`,`getInscritos`(`a`.`id`) AS `inscritos`,cast(`a`.`horas_cert` as char charset utf8) AS `horas_cert` from `bienes_actividades` `a` where (`a`.`eliminado` = '0') */;

/*View structure for view v_transac */

/*!50001 DROP TABLE IF EXISTS `v_transac` */;
/*!50001 DROP VIEW IF EXISTS `v_transac` */;

/*!50001 CREATE ALGORITHM=UNDEFINED DEFINER=`josue.rivera`@`%` SQL SECURITY DEFINER VIEW `v_transac` AS select `t`.`id` AS `id_transac`,`t`.`dni_part` AS `dni_part`,`t`.`marc_update` AS `marc_update`,`t`.`monto` AS `monto`,(select `bienes_lealtad_tipo_transaccion`.`name` from `bienes_lealtad_tipo_transaccion` where (`bienes_lealtad_tipo_transaccion`.`id` = `t`.`idTipo`)) AS `tipo_transac`,(select `bienes_lealtad_transaccion_estados`.`name` from `bienes_lealtad_transaccion_estados` where (`bienes_lealtad_transaccion_estados`.`id` = `t`.`idEstado`)) AS `estado`,ifnull(`getAprobacionNameActividad`(`t`.`IdAprobacion`),`getRedencionPärt`(`t`.`dni_part`,`t`.`IdRedencion`)) AS `detalle`,`t`.`eth_transact` AS `eth_transact` from `bienes_lealtad_transacciones` `t` order by `t`.`marc_update` desc */;

/*View structure for view v_participantes */

/*!50001 DROP TABLE IF EXISTS `v_participantes` */;
/*!50001 DROP VIEW IF EXISTS `v_participantes` */;

/*!50001 CREATE ALGORITHM=UNDEFINED DEFINER=`josue.rivera`@`%` SQL SECURITY DEFINER VIEW `v_participantes` AS select `p`.`dni_part` AS `dni_part`,`p`.`nomb_part` AS `nomb_part`,`p`.`apel_part` AS `apel_part`,`p`.`email_part` AS `email_part`,`a`.`id_actividad` AS `id_actividad`,`a`.`item` AS `item`,`a`.`estado` AS `estado`,`a`.`observacion` AS `observacion`,`a`.`dni_docente` AS `dni_docente`,`a`.`marc_update` AS `marc_update`,`a`.`horas` AS `horas`,`getPrograma`(`p`.`codprog_part`) AS `programa` from (`bienes_actividades_participantes` `a` join `bienes_participantes` `p` on((`a`.`id_participante` = `p`.`dni_part`))) order by `p`.`apel_part`,`p`.`nomb_part` */;

/*View structure for view v_participantes_hacum */

/*!50001 DROP TABLE IF EXISTS `v_participantes_hacum` */;
/*!50001 DROP VIEW IF EXISTS `v_participantes_hacum` */;

/*!50001 CREATE ALGORITHM=UNDEFINED DEFINER=`josue.rivera`@`%` SQL SECURITY DEFINER VIEW `v_participantes_hacum` AS select `bienes_participantes`.`dni_part` AS `dni_part`,`getHorasAcumParticipante`(`bienes_participantes`.`dni_part`) AS `hacum` from `bienes_participantes` where (`bienes_participantes`.`role_part` = '2') */;

/*View structure for view v_actividades */

/*!50001 DROP TABLE IF EXISTS `v_actividades` */;
/*!50001 DROP VIEW IF EXISTS `v_actividades` */;

/*!50001 CREATE ALGORITHM=UNDEFINED DEFINER=`josue.rivera`@`%` SQL SECURITY DEFINER VIEW `v_actividades` AS select `bienes_actividades`.`id` AS `id`,`bienes_actividades`.`nomb_acti` AS `nomb_acti`,`bienes_actividades`.`periodo` AS `periodo`,`bienes_actividades`.`descripcion` AS `descripcion`,`bienes_actividades`.`sesiones` AS `sesiones`,`bienes_actividades`.`cupos` AS `cupos`,`bienes_actividades`.`categoria` AS `idcateg`,`getCategoriaActividad`(`bienes_actividades`.`categoria`) AS `categoria`,`bienes_actividades`.`id_depart` AS `id_depart`,`getDepartamento`(`bienes_actividades`.`id_depart`) AS `depart`,`getFechaInicioActividad`(`bienes_actividades`.`id`) AS `fecha_inicio`,`getFechaFinActividad`(`bienes_actividades`.`id`) AS `fecha_fin`,`bienes_actividades`.`idBonus` AS `idBonus`,`getPointsBonus`(`bienes_actividades`.`idBonus`) AS `puntos`,`bienes_actividades`.`tipo_aprob` AS `idtipo_aprob`,`getAprobacionTipo`(`bienes_actividades`.`tipo_aprob`) AS `tipo_aprob`,`getAprobacionTipoDesc`(`bienes_actividades`.`tipo_aprob`) AS `tipo_aprob_desc`,`getProgramaOfertaActividad`(`bienes_actividades`.`id`) AS `oferta_programa`,`getProgramaNameOfertaActividad`(`bienes_actividades`.`id`) AS `oferta_programahum`,`getRoleOfertaActividad`(`bienes_actividades`.`id`) AS `oferta_rol`,`getRoleNameOfertaActividad`(`bienes_actividades`.`id`) AS `oferta_rolhum`,`bienes_actividades`.`dni_docente` AS `dni_docente`,`getAdminName`(`bienes_actividades`.`dni_docente`) AS `docente`,`esCertificable`(`bienes_actividades`.`id`) AS `certificable`,`tieneCuposDisponibles`(`bienes_actividades`.`id`) AS `tienecupos`,`tieneAprobaciones`(`bienes_actividades`.`id`) AS `tieneaprobaciones`,`getInscritos`(`bienes_actividades`.`id`) AS `inscritos`,cast(`bienes_actividades`.`horas_cert` as char charset utf8) AS `horas_cert` from `bienes_actividades` where (`bienes_actividades`.`eliminado` = '0') order by `bienes_actividades`.`id` desc */;

/*View structure for view v_actividades_categ_horas */

/*!50001 DROP TABLE IF EXISTS `v_actividades_categ_horas` */;
/*!50001 DROP VIEW IF EXISTS `v_actividades_categ_horas` */;

/*!50001 CREATE ALGORITHM=UNDEFINED DEFINER=`josue.rivera`@`%` SQL SECURITY DEFINER VIEW `v_actividades_categ_horas` AS select `bienes_actividades`.`id` AS `id`,`bienes_actividades`.`nomb_acti` AS `nomb_acti`,`getCategoriaActividad`(`bienes_actividades`.`categoria`) AS `categ`,`getHorasActividad`(`bienes_actividades`.`id`) AS `horas`,`bienes_actividades`.`periodo` AS `periodo`,`bienes_actividades`.`categoria` AS `categoria` from `bienes_actividades` where (`bienes_actividades`.`eliminado` = '0') */;

/*View structure for view v_aprobados_cualificacion */

/*!50001 DROP TABLE IF EXISTS `v_aprobados_cualificacion` */;
/*!50001 DROP VIEW IF EXISTS `v_aprobados_cualificacion` */;

/*!50001 CREATE ALGORITHM=UNDEFINED DEFINER=`josue.rivera`@`%` SQL SECURITY DEFINER VIEW `v_aprobados_cualificacion` AS select `a`.`id_actividad` AS `ID_ACTIVIDAD`,`act`.`nomb_acti` AS `ACTIVIDAD`,`act`.`horas` AS `HORAS`,`a`.`dni_part` AS `DNI_PARTICIPANTE`,`a`.`marc_update` AS `FECHA_APROBACION`,`act`.`periodo` AS `PERIODO`,`act`.`categ` AS `CATEGORIA`,`act`.`categoria` AS `ID_CATEGORIA` from (`bienes_aprobaciones_actividades` `a` join `v_actividades_categ_horas` `act`) where ((`a`.`aprobado` = '1') and (`a`.`anulado` = '0') and (`a`.`id_actividad` = `act`.`id`) and (`act`.`categoria` in ('20','21','22','23','24'))) */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
