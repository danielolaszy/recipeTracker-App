<!--
*** Thanks for checking out the Best-README-Template. If you have a suggestion
*** that would make this better, please fork the repo and create a pull request
*** or simply open an issue with the tag "enhancement".
*** Thanks again! Now go create something AMAZING! :D
-->

<!-- PROJECT SHIELDS -->
<!--
*** I'm using markdown "reference style" links for readability.
*** Reference links are enclosed in brackets [ ] instead of parentheses ( ).
*** See the bottom of this document for the declaration of the reference variables
*** for contributors-url, forks-url, etc. This is an optional, concise syntax you may use.
*** https://www.markdownguide.org/basic-syntax/#reference-style-links
-->

<!-- PROJECT LOGO -->
<br />
<p align="center">
  <a href="https://github.com/danielolaszy/wowRecipeTracker">
    <img src="images/logo.png" alt="Logo" width="80" height="80">
  </a>

  <h3 align="center">Arato</h3>

  <p align="center">
    A simple way to track your recipe collections in World of Warcraft!
    <br />
    <a href="https://github.com/danielolaszy/wowRecipeTracker"><strong>Explore the docs »</strong></a>
    <br />
    <br />
    <a href="https://github.com/danielolaszy/wowRecipeTracker">View Demo</a>
    ·
    <a href="https://github.com/danielolaszy/wowRecipeTracker/issues">Report Bug</a>
    ·
    <a href="https://github.com/danielolaszy/wowRecipeTracker/issues">Request Feature</a>
  </p>
</p>

<!-- TABLE OF CONTENTS -->
<details open="open">
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#acknowledgements">Acknowledgements</a></li>
  </ol>
</details>

<!-- ABOUT THE PROJECT -->

## About The Project

[![Product Name Screen Shot][product-screenshot]](https://github.com/danielolaszy/wowRecipeTracker)

There are many websites out on the internet that allows you to track collected recipes in World of Warcraft. Unfortunately one of them has been depreciated for a couple of years and one other was difficult to look at and see which recipes needed collecting and which did not. I didn't find one that really suited my needs so I created this enhanced one. This will be the last recipe tracker you'll ever need.

Here's why:

- Your time should be focused on farming recipes and not navigating the website.
- The site should present the information in a simple manner.

A list of inspirations and commonly used resources that I found helpful are listed in the acknowledgements.

### Built With
React was used in order to make it easy to build the interface thanks to React being component-based.
Bootstrap was used for the styling as it is easy to use and makes development of the front end very quick.

- [React](https://reactjs.org/)
- [Bootstrap](https://getbootstrap.com)

<!-- GETTING STARTED -->

## Getting Started

In order to get started with the project you'll need to have NPM. To get the project running locally, follow these simple steps.

### Prerequisites

- npm

  ```sh
  npm install npm@latest -g
  ```

### Installation

1. Get a free API Key at [develop.battle.net](https://develop.battle.net/)
2. Clone the repo
   ```sh
   git clone https://github.com/danielolaszy/wowRecipeTracker.git
   ```
3. Install NPM packages
   ```sh
   npm install
   ```
4. Enter your API client ID and client secret in a `.env` file
   ```JS
   REACT_APP_CLIENT_ID=
   REACT_APP_CLIENT_SECRET=
   ```

<!-- ACKNOWLEDGEMENTS -->

## Acknowledgements

- [Axios](https://github.com/axios/axios)
- [qs](https://github.com/ljharb/qs)
- [react-router](https://reactrouter.com/)
- [Framer Motion](https://www.framer.com/motion/)
- [React Spinners Kit](https://github.com/dmitrymorozoff/react-spinners-kit)
- [Font Awesome](https://fontawesome.com)

<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->

[contributors-shield]: https://img.shields.io/github/contributors/othneildrew/Best-README-Template.svg?style=for-the-badge
[contributors-url]: https://github.com/othneildrew/Best-README-Template/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/othneildrew/Best-README-Template.svg?style=for-the-badge
[forks-url]: https://github.com/othneildrew/Best-README-Template/network/members
[stars-shield]: https://img.shields.io/github/stars/othneildrew/Best-README-Template.svg?style=for-the-badge
[stars-url]: https://github.com/othneildrew/Best-README-Template/stargazers
[issues-shield]: https://img.shields.io/github/issues/othneildrew/Best-README-Template.svg?style=for-the-badge
[issues-url]: https://github.com/othneildrew/Best-README-Template/issues
[license-shield]: https://img.shields.io/github/license/othneildrew/Best-README-Template.svg?style=for-the-badge
[license-url]: https://github.com/othneildrew/Best-README-Template/blob/master/LICENSE.txt
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedin-url]: https://linkedin.com/in/othneildrew
[product-screenshot]: images/screenshot.png
