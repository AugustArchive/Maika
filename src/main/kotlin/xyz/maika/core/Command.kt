package xyz.maika.core

import net.dv8tion.jda.core.Permission

@Retention(AnnotationRetention.RUNTIME)
@Target(AnnotationTarget.CLASS)
annotation class Command(
        val name: String,
        val description: String,
        val usage: String = "",
        val aliases: Array<String> = [],
        val category: CommandCategory = CommandCategory.GENERIC,
        val permissions: Array<Permission> = []
)