package com.nexus.kochservice

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication

@SpringBootApplication
class KochserviceApplication

fun main(args: Array<String>) {
	runApplication<KochserviceApplication>(*args)
}
