const mainIndex = (function() {

    // Varialbe Declaration
    const leftNav_HTML = `
        <div id="brandLogo" class="brandLogo">
            <img src="./assets/images/logo.png" alt="brand logo">
            <label id="brand-name">En-Vidhaya</label>
        </div>
        <div class="toplinks">
            <a href="#">Activities</a>
            <a href="#">Events</a>
            <a href="#">Help</a>
        </div>
    `

    const keyboard_HTML = `<div id="keyboard" class="keyboard">
        <div class="lights">
            <span>1</span>
            <span>A</span>
            <span>V</span>
        </div>
    
        <div class="section-a">
            <div id="esc" class="key function space1">
                Esc
            </div>
    
            <div id="f1" class="key function">
                F1
            </div>
            <div id="f2" class="key function">
                F2
            </div>
            <div id="f3" class="key function">
                F3
            </div>
    
            <div id="f4" class="key function space2">
                F4
            </div>
            <div id="f5" class="key function">
                F5
            </div>
            <div class="key function">
                F6
            </div>
            <div class="key function">
                F7
            </div>
            <div class="key function space2">
                F8
            </div>
    
            <div class="key function">
                F9
            </div>
            <div class="key function">
                F10
            </div>
            <div class="key function">
                F11
            </div>
            <div class="key function">
                F12
            </div>
            <!--END FUNCTION KEYS -->
    
            <div class="key num dual">
                ~<br>
            </div>
    
            <div class="key num dual">
                !<br>1
            </div>
            <div class="key num dual">
                @<br>2
            </div>
            <div class="key num dual">
                #<br>3
            </div>
            <div class="key num dual">
                $<br>4
            </div>
            <div class="key num dual">
                %<br>5
            </div>
            <div class="key num dual">
                ^<br>6
            </div>
            <div class="key num dual">
                &<br>7
            </div>
            <div class="key num dual">
                *<br>8
            </div>
            <div class="key num dual">
                (<br>9
            </div>
            <div class="key num dual">
                )<br>0
            </div>
            <div class="key num dual">
                _<br>-
            </div>
            <div class="key num dual">
                +<br>=
            </div>
            <div class="key backspace">
                Backspace
            </div>
            <!--END NUMBER KEYS -->
    
            <div class="key tab">
                Tab
            </div>
    
            <div id="q" class="key letter">
                Q
            </div>
            <div id="w" class="key letter">
                W
            </div>
            <div id="e" class="key letter">
                E
            </div>
            <div id="r" class="key letter">
                R
            </div>
            <div id="t" class="key letter">
                T
            </div>
            <div id="y" class="key letter">
                Y
            </div>
            <div id="u" class="key letter">
                U
            </div>
            <div id="i" class="key letter">
                I
            </div>
            <div id="o" class="key letter">
                O
            </div>
            <div id="p" class="key letter">
                P
            </div>
            <div class="key dual">
                {<Br>[
            </div>
            <div class="key dual">
                }<br>]
            </div>
            <div class="key letter dual slash">
                |<br>\
            </div>
            <div class="key caps">
                Caps<br>Lock
            </div>
            <div id="a" class="key letter">
                A
            </div>
            <div id="s" class="key letter">
                S
            </div>
            <div id="d" class="key letter">
                D
            </div>
            <div id="f" class="key letter">
                F
            </div>
            <div id="g" class="key letter">
                G
            </div>
            <div id="h" class="key letter">
                H
            </div>
            <div id="j" class="key letter">
                J
            </div>
            <div id="k" class="key letter">
                K
            </div>
            <div id="l" class="key letter">
                L
            </div>
            <div class="key dual">
                :<br>;
            </div>
            <div class="key dual">
                "<br>'
            </div>
            <div class="key enter">
                Enter
            </div>
    
            <div class="key shift left">
                Shift
            </div>
            <div id="z" class="key letter">
                Z
            </div>
            <div id="x" class="key letter">
                X
            </div>
            <div id="c" class="key letter">
                C
            </div>
            <div id="v" class="key letter">
                V
            </div>
            <div id="b" class="key letter">
                B
            </div>
            <div id="n" class="key letter">
                N
            </div>
            <div id="m" class="key letter">
                M
            </div>
            <div class="key dual">
                < <br>,
            </div>
            <div class="key dual">
                ><br>.
            </div>
            <div class="key dual">
                ?<br>/
            </div>
            <div class="key shift right">
                Shift
            </div>
            <div class="key ctrl">
                Ctrl
            </div>
            <div class="key">
                &hearts;
            </div>
            <div class="key">
                Alt
            </div>
            <div class="key space">
    
    
    
            </div>
            <div class="key">
                Alt
            </div>
            <div class="key">
                &hearts;
            </div>
            <div class="key">
                Prnt
            </div>
            <div class="key ctrl">
                Ctrl
            </div>
        </div><!-- end section-a-->
    
        <div class="section-b">
            <div class="key function small">
                Prnt Scrn
            </div>
            <div class="key function small">
                Scroll Lock
            </div>
            <div class="key function small">
                Pause Break
            </div>
    
            <dic class="sec-func">
                <div class="key">
                    Insert
                </div>
                <div class="key">
                    Home
                </div>
                <div class="key dual">
                    Page Up
                </div>
                <div class="key">
                    Del
                </div>
                <div class="key">
                    End
                </div>
                <div class="key dual">
                    Page Down
                </div>
    
                <div class="arrows">
                    <div class="key hidden">
    
                    </div>
                    <div class="key">
                        ^
                    </div>
                    <div class="key hidden">
    
                    </div>
                    <div class="key">
                        < </div> <div class="key">
                            v
                    </div>
                    <div class="key">
                        >
                    </div>
                </div><!-- end arrows -->
            </div><!-- end sec-func -->
        </div><!-- end section-b-->
    </div>
    `

    const rightNav_HTML = `
    <div class="interaction">
        <button id="voiceAssis"><img src="./assets/images/voice_assis.jfif" alt=""></button>
    </div>

    <div class="arrow-key">
        ${keyboard_HTML}
    </div>
    `
    
    const leftNav = document.getElementById('leftNav')
    const rightNav = document.getElementById('rightNav')
    const mainContent = document.getElementById('mainContent')
    let isNavOpen = false


    // Functions here

    renderInitMain = () =>{
        rightNav.innerHTML = rightNav_HTML
        leftNav.innerHTML = leftNav_HTML
    }

    openNav = () => {
        leftNav.classList.add('sidenav-open')
        mainContent.classList.add('main-shiftLeft')
        isNavOpen = true
    }

    closeNav = () => {
        leftNav.classList.remove('sidenav-open')
        mainContent.classList.remove('main-shiftLeft')
        isNavOpen = false
    }

    voiceAssistant = (voiceMessage) => {
        let speech = new SpeechSynthesisUtterance()
        speech.rate = 0.7
        speech.pitch = 1
        speech.volume = 1
        speech.voice = speechSynthesis.getVoices()[0]
        speech.text = voiceMessage

        speechSynthesis.speak(speech)
    }

    generateDelay = (function_name, delayTime) =>{
        setTimeout(function_name,delayTime)
    }

    performNavOperation = (event) =>{
        if(isNavOpen)
            closeNav()
        else
            openNav()
    }

    loadMainWindow = (event) =>{
        renderInitMain()
        openNav()
        // Automatically close the left navbar after 2sec
        generateDelay(closeNav, 2000)
    }

    
    // Event bindings

    window.addEventListener('load', loadMainWindow)
    
})()