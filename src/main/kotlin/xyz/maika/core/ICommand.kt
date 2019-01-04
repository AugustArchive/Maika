package xyz.maika.core

interface ICommand {
    fun execute(ctx: CommandContext)
    val info: Command
        get() {
            return this.javaClass.getAnnotation(Command::class.java)
        }
}