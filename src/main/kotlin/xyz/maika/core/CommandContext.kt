package xyz.maika.core

import net.dv8tion.jda.core.events.message.guild.GuildMessageReceivedEvent
import net.dv8tion.jda.core.JDA
import net.dv8tion.jda.core.EmbedBuilder
import net.dv8tion.jda.core.entities.*

import java.awt.Color

class CommandContext(val event: GuildMessageReceivedEvent, val argString: String) {
    val channel: TextChannel = event.channel
    val message: Message = event.message
    val guild: Guild = event.guild
    val jda: JDA = event.jda
    val member: Member = event.member
    val args: Array<String> = argString.split("\\+s".toRegex()).toTypedArray()

    fun embed(block: EmbedBuilder.() -> Unit) {
        channel.sendMessage(
                EmbedBuilder()
                        .setColor(Color(230, 126, 222))
                        .apply(block)
                        .build()
        ).queue()
    }

    fun reply(content: String) {
        channel.sendMessage(content).queue()
    }

    fun reply(content: String, success: (Message) -> Unit) {
        channel.sendMessage(content).queue(success)
    }
}