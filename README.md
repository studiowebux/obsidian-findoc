<div align="center">

<img src="./docs/findoc-256.png" alt="Findoc Logo" width="256">

<h2>Obsidian Fin Doc</h2>

<p>Obsidian.md plugin to read and edit a CSV file, then use it as a data source to generate charts.</p>
<p>I invite you to create PR and Issues with ideas, improvements and etc.</p>

<p align="center">
  <a href="https://github.com/studiowebux/obsidian-findoc/issues">Report Bug</a>
  ·
  <a href="https://github.com/studiowebux/obsidian-findoc/issues">Request Feature</a>
  ·
  <a href="https://discord.gg/SseMxexTF6">Discord Support</a>
</p>
</div>

---

## About

- Open and Edit CSV Files in Obsidian
- Generate Charts (Line, Pie, Radar) and Table Reports using CSV data
- Advanced Model Management: Add, edit, duplicate, and delete custom models via settings
- Enhanced Data Processing: Quarter/week splitting, category analysis, value ranges
- Resizable charts with professional table views
- Support Desktop and Mobile (tested on Windows, MacOS and Iphone)
- Using [Chart.js](https://www.chartjs.org) and [mathjs](https://mathjs.org)
- Plugin for [Obsidian.md](https://obsidian.md)

---

## Installation and Usage

[Full Documentation is available here](https://studiowebux.github.io/obsidian-findoc/)
---

## Changelog

See [CHANGELOG](./CHANGELOG)

---

### Releases and Github Actions

```bash
git tag -a X.Y.Z -m "Version X.Y.Z"
git push origin tags/X.Y.Z
```

---

## Contributing

1. Fork Repository
2. Commit your changes
3. Push your changes
4. Create a PR

### Local Development

```bash
npm install
npm run build
```

### Documentation

```bash
minimaldoc build \
    --base-url / \
    --description "Obsidian.md plugin to read and edit a CSV file, then use it as a data source to generate charts." \
    --title "Obsidian FinDoc" \
    --llms \
    --output ./output \
    ./docs/
    
python -m http.server -d output 8003
```

## License

Distributed under the MIT License. See LICENSE for more information.

## Contact

- Tommy Gingras @ tommy@studiowebux.com | Studio Webux

<div>
<b> | </b>
<a href="https://www.buymeacoffee.com/studiowebux" target="_blank"
      ><img
        src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png"
        alt="Buy Me A Coffee"
        style="height: 30px !important; width: 105px !important"
/></a>
<b> | </b>
<a href="https://webuxlab.com" target="_blank"
      ><img
        src="https://webuxlab-static.s3.ca-central-1.amazonaws.com/logoAmpoule.svg"
        alt="Webux Logo"
        style="height: 30px !important"
/> Webux Lab</a>
<b> | </b>
<a href="https://studiowebux.com" target="_blank"
      >Studio Webux</a>
<b> | </b>
</div>
