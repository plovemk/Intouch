


# Intouch Tools Setup and Documentation
***
# Set Up
<!-- 1. Install Scoop https://scoop.sh/ - Inside Powershell run this command to install scoop

      `iex (new-object net.webclient).downloadstring('https://get.scoop.sh')` -->
<!-- 2.  Map the networked intouch folder to your computer `\\SERVERNAME\US_CS_Web\InTouch`   
    Call this new mapped drive "`Z`".   
    https://support.microsoft.com/en-us/help/4026635/windows-map-a-network-drive -->
1.  Run the following command in POWERSHELL to Install Dev Tools and Project Dependencies.

```
      iex (new-object net.webclient).downloadstring('http://bit.ly/intouchmk')
```

<!--
# Install Dev Tools
1. Copy and execute this command in Powershell

```
      Scoop install git; Scoop install cygwin; Scoop bucket add extras; Scoop install atom; Scoop install nodejs; git clone https://github.com/plovemk/Intouch.git
```
2. Create a .npmrc file in the root directory of Intouch and put the next two lines of code in there to set ENV variables.

  \**This will skip puppeteer from downloading chromium. The version of chromium in Puppeteer is incompatible with windows. A working version of Chromium will be installed separately in a node package.*


        puppeteer_skip_chromium_download=true    
        PUPPETEER_CHROMIUM_REVISION=1.0.2

# Install Dependencies

      npm run getAlias; nad; nr pshell; npm install -g concurrently; nr setup

#### Steps 1 - 5 are the same as the line above.
1. Install Alias (skip this if you don't want this.) https://www.npmjs.com/package/@gkalpak/aliases   
`npm run getAlias`   
    ###### After Alias is installed:    
    Run `halp` for a list of all available aliases. Run `halp <category>` for a list of available aliases for a particular category (e.g. git, node, misc).

2.  Install dependencies   
  `npm install` or if you did step 2 `nad` -->

<!-- 3. Load the powershell files into the powershell directory.    
  `npm run pshell`  
  If you did step 2   `nr pshell`    


4. Install concurrently `npm install -g concurrently`
5. Run the Script to setup global dependencies and Scoop packages

      `nr setup`  -->

# Check Environment Variables
 Run this command to check if variables were set correctly

 Checking the values for *INTOUCH_SERV, INTOUCH_BASE*

     Get-ChildItem Env:

<!-- 1. Set up environment variables at the root of this project in a .env file - scroll down to bottom of the page. -->
<!-- 2. Set up environment variables in PowerShell - scroll down to bottom of the page. -->
<!-- ### Everything is ready. Read below to see available functions. -->


***
# Functions  | Aliases --- *Generated files*

Each function requires a path to a project as a string.

This example launches the process for creating a new webpage project.  
example: `newPage "\\SERVERNAME\Uunches\20110\1118\235611 PE Winter DEO WP and Ads 10-15-18\Working folder"`

*The generated file types are in italics.*
###### makeImages "path-to-release-folder"   
 images | imgs | createImage ----- *jpg*

###### missingLinks "path-to-release-folder"   
 needLinks | links | ml | missing | miss ----- *json*

###### newCard "path-to-working-folder"   
 nc | card ---- *html,* *txt,* *cid-url.txt,* *json*

###### newPage "path-to-working-folder"   
 np | page | makepage ---- *html*

###### searchJob "query" [integer - *optional*]
search | find | sd | fd --- *no files generated*

###### ~~makeText[not working]~~

###### makeBoards "path-to-working-folder" [english or spanish] [version]
  pdf | boards | mb ---- *pdf*

###### releaseWebpage JobID
rw | rwp | reweb ---- *Email Draft in Outlook*

###### releaseEcards JobID
rec | rj | relec | rtj ---- *Email Draft in Outlook*

##### getJobStatus JobID
jstat | stat | js ---- *No files generated*

##### getDevReport "Name of dev to search" [string - *optional*]
incoming | ij | jobs ---- *No files generated*

###### *The folders in ecards  will be created. The structure may be a little different to how you set things up.
###### *For missingLinks to work, the anchor tags will need a '#' in the href attribute. `<a href="#"></a>`

***

# Folder Structure
### eCards
English[folder]-->nsd-ibc[folder]-->htm, txt, images[files]

Spanish[folder]-->nsd-ibc[folder]-->htm, txt, images[files]
***

# Notes
Run this script if errors are being thrown when running npm install    
 `npm config set strict-ssl false`   


### Make your own aliases for function names.
1. Don't change the files inside this project folder.
2. The powershell scripts that do the heavy lifting are in this path ....

 `C:\Users\USERNAME*\Documents\WindowsPowerShell\Scripts\`  
  **USERNAME**\* = Your user name on your computer

3. At the bottom of each script is a cmdlt that will make a new Alias.

    `Set-Alias newName functionName`  
    example: `Set-Alias images makeImages`   
