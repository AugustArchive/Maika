<img src="https://augu.me/files/g4fseu.png" align="center" alt="Maika Avatar">

# Maika [![Discord](https://discordapp.com/api/guilds/382725233695522816/embed.png)](https://discord.gg/7TtMP2n)
> :sparkles: **Customizable, stable Discord multipurpopse bot made in the Eris library.**

## Contributing
Pull Requests are accepted, but you will have to lint the code (`yarn lint` or `npm run lint`) and see if it has errors and such.

## TODO
- Actually do the Music plugin (might come in an later release)
- Add functionality to donators
  - Smaller throttle (cooldowns)
  - More coins
  - Custom Badge
  - Patreon Bot (might not come true)
  - More to come?
- Image Manipulation (unique or use Dank Memer's service) (might not come true)

## Running
As per the developement team, (if you wanna run Maika) we expect you to know how to run Maika. All you need is [RethinkDB](https://github.com/MaikaBot/Maika/blob/master/README.md#why-rethinkdb) and MongoDB.

## Why RethinkDB
We use RethinkDB for interval cache.
But August, why not use Redis to cache daily & reminder interval cache? Because I don't wanna run Redis on my machine (because I'm lazy to install it) and I don't know how. (~~You can try to submit a Pull Request to use Redis for interval cache~~) But, we use MongoDB for guilds, users, tags, levels, etc as it's main database.

## License
> [Maika](https://github.com/MaikaBot/Maika) is released under the [MIT](https://github.com/MaikaBot/Maika/blob/master/LICENSE) license and maintained by [auguwu](https://augu.me)

```
Copyright (c) 2018-present auguwu

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```
