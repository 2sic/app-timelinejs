<image src="app-icon.png" align="right" width="200px">

# TimelineJS 2 - Timeline App for .net CMSs

> This is a [2sxc](https://2sxc.org) App for [DNN ☢️](https://www.dnnsoftware.com/) and [Oqtane 💧](https://www.oqtane.org/)

CMS Slider App using the popular [Swiper JS](https://swiperjs.com/). It does not use jQuery 😉.


| Aspect              | Status | Comments or Version |
| ------------------- | :----: | ------------------- |
| 2sxc                | ✅    | requires 2sxc v16.04
| Dnn                 | ✅    | For v9.6.1+
| Oqtane 2            | ✅    | Requires v04.00+
| No jQuery           | ✅    | Since v 2.01
| Source & License    | ✅    | included, MIT
| App Catalog         | ✅    | See [app catalog](https://2sxc.org/en/apps/app/timelinejs-app-v2-hybrid-for-dnn-and-oqtane)
| Best Practices      | ✅    | Uses v13.10 conventions
| Bootstrap 3         | ✔️    | Works with BS3
| Bootstrap 4         | ✔️    | Works with BS4
| Bootstrap 5         | ✔️    | Works with BS5

## Customize the App

If you want to customize the CSS, you will usually follow the ["Create Custom Styles in a Standard 2sxc App" checklist](https://azing.org/2sxc/r/gg_aB9FD)


## Thanks to

[TimelineJS](https://timeline.knightlab.com/) for their awesome open-source library

## History

* v.2.00.00 2022-03
  * updated to 2sxc 12.0 standards
  * made hybrid / compatible with Oqtane
  * removed jQuery
  * updated to timelinejs v3
  * switched to typescript
  * enabled data-optimizations
* v.2.01.00 2022-04
  * Replaced data-enableoptimizations with pageSvc.AssetAttributes()
* v.02.02.00 2022-06
  * Changed all base classes to their 2sxc 14 equivalents
  * Replaced all GetService<> with the new ServiceKit14
  * Updated webpack
* v.02.03.00 2023-05
  * Removed _ from Filenames
  * Replaced turnOn Tag with `Kit.Page.TurnOn`
* v02.04.00 2023-07
  * 2sxc 16.02 coding conventions
  * everything typed
* v02.04.01 2024-07
  * Add app.sln and app.csproj