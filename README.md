# LightSaber

**[zeroxjf.github.io/lightsaber](https://zeroxjf.github.io/lightsaber/)**

iOS 18.4 - 18.6.2 userland exploit chain with JavaScript injection that modifies SpringBoard and other system processes at runtime. Open source, derived from [DarkSword](https://iverify.io/blog/darksword-ios-exploit-kit-explained) with all malware communication stripped.

> **This is not tweak injection.** It is runtime JS modification through an exploit chain. Changes persist until respring or reboot - this is not dylib injection like a full jailbreak.

## Supported devices

Every arm64e iPhone (A12 - A18 Pro) running iOS 18.4 - 18.6.2.

## Roadmap

> **To do**
>
> - [ ] Improve chain reliability and reproducibility
> - [ ] Add offsets to support more iOS 18.x versions
> - [ ] Get StatBar functional (data reporting works but UI display hits nonstop PAC violations)
> - [ ] Resolve compatibility issues with Nugget and similar tools

> **Done**
>
> - [x] Full WebContent RCE → kernel R/W → sandbox escape chain
> - [x] SBCustomizer (dock icons, home grid columns/rows, hide labels)
> - [x] Powercuff battery saver (4 throttle levels via thermalmonitord)
> - [x] Multi-tweak picker with single chain execution
> - [x] Support for every arm64e iPhone on iOS 18.4 - 18.6.2
> - [x] #cloutfarmed

## How it works

LightSaber chains a WebContent RCE into kernel R/W via sandbox escape, then uses a JSC + `objc_msgSend` / `dlsym` native bridge to inject JavaScript into other processes (SpringBoard, mediaplaybackd, thermalmonitord, etc.).

### Chain stages

| Stage | Where | What |
|---|---|---|
| `index.html` | Safari main page | Install card UI, tweak picker, gating |
| `rce_loader.js` | WebContent iframe | URL parser, postMessage routing, exploit bootstrap |
| `rce_worker*.js` | WebContent worker | JavaScriptCore exploit, addrof/fakeobj/read64/write64 primitives |
| `rce_module*.js` | WebContent worker | Heap shaping, PAC gadget signing |
| `sbx0_main_18.4.js` | WebContent worker | Sandbox escape |
| `sbx1_main.js` | mediaplaybackd | Prelude builder, kernel R/W, process injection bridge |
| `pe_main.js` | mediaplaybackd | Payload dispatch, `inject*Payload` helpers |
| `*_light.js` | Target processes | Tweak payloads (run via the native bridge) |

## Available tweaks

### SBCustomizer

Runtime SpringBoard layout customization: dock icon count, home screen columns and rows, hide icon labels. Patched once during chain execution.

### Powercuff

Port of [rpetrich's Powercuff](https://github.com/rpetrich/Powercuff). Underclocks CPU/GPU via thermalmonitord for extended battery life. Four levels: nominal, light, moderate, heavy. Lasts until reboot.

## Usage

Visit [zeroxjf.github.io/lightsaber](https://zeroxjf.github.io/lightsaber/) in Safari on a supported device. Pick your tweaks, tap **Install Selected**, and keep Safari in the foreground for up to 60 seconds while the chain runs.

**If it fails** (page flash, "A problem repeatedly occurred", or "webpage crashed" banner): clear Safari's cache (book icon > Clear), reload, and retry. If it keeps failing, reboot, clear cache again, and try once more.

## Project structure

```
index.html              Main install page (Safari UI)
frame.html              Exploit iframe shell
rce_loader.js           Iframe-side bootstrap + postMessage router
rce_worker.js           WebContent worker (iOS 18.4)
rce_worker_18.6.js      WebContent worker (iOS 18.5-18.6.2)
rce_module.js           Heap shaping module (18.4)
rce_module_18.6.js      Heap shaping module (18.5-18.6.2)
sbx0_main_18.4.js       Sandbox escape
sbx1_main.js            Kernel R/W + process injection bridge
pe_main.js              Payload dispatch in mediaplaybackd
powercuff_light.js      Powercuff payload
sbcustomizer_light.js   SBCustomizer payload
colorbanners_light.js   ColorBanners payload (WIP)
syslog.py               Device syslog capture helper
```

## Credits

- [DarkSword](https://iverify.io/blog/darksword-ios-exploit-kit-explained) - the original exploit chain this is derived from
- [34306](https://github.com/34306) & [khanhduytran0](https://github.com/khanhduytran0) - their [site design](http://34306.lol/darksword/) helped stabilize payload delivery
- [@cro4js](https://twitter.com/cro4js) - UI suggestions
- [rpetrich](https://github.com/rpetrich/Powercuff) - original Powercuff tweak
- Anonymous contributors for help stabilizing the exploit chain

## License

MIT License. See [LICENSE](LICENSE) for details.
