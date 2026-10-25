(() => {
  // node_modules/fflate/esm/browser.js
  var u8 = Uint8Array;
  var u16 = Uint16Array;
  var i32 = Int32Array;
  var fleb = new u8([
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    1,
    1,
    1,
    1,
    2,
    2,
    2,
    2,
    3,
    3,
    3,
    3,
    4,
    4,
    4,
    4,
    5,
    5,
    5,
    5,
    0,
    /* unused */
    0,
    0,
    /* impossible */
    0
  ]);
  var fdeb = new u8([
    0,
    0,
    0,
    0,
    1,
    1,
    2,
    2,
    3,
    3,
    4,
    4,
    5,
    5,
    6,
    6,
    7,
    7,
    8,
    8,
    9,
    9,
    10,
    10,
    11,
    11,
    12,
    12,
    13,
    13,
    /* unused */
    0,
    0
  ]);
  var clim = new u8([16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15]);
  var freb = function(eb, start) {
    var b = new u16(31);
    for (var i = 0; i < 31; ++i) {
      b[i] = start += 1 << eb[i - 1];
    }
    var r = new i32(b[30]);
    for (var i = 1; i < 30; ++i) {
      for (var j = b[i]; j < b[i + 1]; ++j) {
        r[j] = j - b[i] << 5 | i;
      }
    }
    return { b, r };
  };
  var _a = freb(fleb, 2);
  var fl = _a.b;
  var revfl = _a.r;
  fl[28] = 258, revfl[258] = 28;
  var _b = freb(fdeb, 0);
  var fd = _b.b;
  var revfd = _b.r;
  var rev = new u16(32768);
  for (i = 0; i < 32768; ++i) {
    x = (i & 43690) >> 1 | (i & 21845) << 1;
    x = (x & 52428) >> 2 | (x & 13107) << 2;
    x = (x & 61680) >> 4 | (x & 3855) << 4;
    rev[i] = ((x & 65280) >> 8 | (x & 255) << 8) >> 1;
  }
  var x;
  var i;
  var hMap = (function(cd, mb, r) {
    var s = cd.length;
    var i = 0;
    var l = new u16(mb);
    for (; i < s; ++i) {
      if (cd[i])
        ++l[cd[i] - 1];
    }
    var le = new u16(mb);
    for (i = 1; i < mb; ++i) {
      le[i] = le[i - 1] + l[i - 1] << 1;
    }
    var co;
    if (r) {
      co = new u16(1 << mb);
      var rvb = 15 - mb;
      for (i = 0; i < s; ++i) {
        if (cd[i]) {
          var sv = i << 4 | cd[i];
          var r_1 = mb - cd[i];
          var v = le[cd[i] - 1]++ << r_1;
          for (var m = v | (1 << r_1) - 1; v <= m; ++v) {
            co[rev[v] >> rvb] = sv;
          }
        }
      }
    } else {
      co = new u16(s);
      for (i = 0; i < s; ++i) {
        if (cd[i]) {
          co[i] = rev[le[cd[i] - 1]++] >> 15 - cd[i];
        }
      }
    }
    return co;
  });
  var flt = new u8(288);
  for (i = 0; i < 144; ++i)
    flt[i] = 8;
  var i;
  for (i = 144; i < 256; ++i)
    flt[i] = 9;
  var i;
  for (i = 256; i < 280; ++i)
    flt[i] = 7;
  var i;
  for (i = 280; i < 288; ++i)
    flt[i] = 8;
  var i;
  var fdt = new u8(32);
  for (i = 0; i < 32; ++i)
    fdt[i] = 5;
  var i;
  var flrm = /* @__PURE__ */ hMap(flt, 9, 1);
  var fdrm = /* @__PURE__ */ hMap(fdt, 5, 1);
  var max = function(a) {
    var m = a[0];
    for (var i = 1; i < a.length; ++i) {
      if (a[i] > m)
        m = a[i];
    }
    return m;
  };
  var bits = function(d, p, m) {
    var o = p / 8 | 0;
    return (d[o] | d[o + 1] << 8) >> (p & 7) & m;
  };
  var bits16 = function(d, p) {
    var o = p / 8 | 0;
    return (d[o] | d[o + 1] << 8 | d[o + 2] << 16) >> (p & 7);
  };
  var shft = function(p) {
    return (p + 7) / 8 | 0;
  };
  var slc = function(v, s, e) {
    if (s == null || s < 0)
      s = 0;
    if (e == null || e > v.length)
      e = v.length;
    return new u8(v.subarray(s, e));
  };
  var ec = [
    "unexpected EOF",
    "invalid block type",
    "invalid length/literal",
    "invalid distance",
    "stream finished",
    "no stream handler",
    ,
    // determined by compression function
    "no callback",
    "invalid UTF-8 data",
    "extra field too long",
    "date not in range 1980-2099",
    "filename too long",
    "stream finishing",
    "invalid zip data"
    // determined by unknown compression method
  ];
  var err = function(ind, msg, nt) {
    var e = new Error(msg || ec[ind]);
    e.code = ind;
    if (Error.captureStackTrace)
      Error.captureStackTrace(e, err);
    if (!nt)
      throw e;
    return e;
  };
  var inflt = function(dat, st, buf, dict) {
    var sl = dat.length, dl = dict ? dict.length : 0;
    if (!sl || st.f && !st.l)
      return buf || new u8(0);
    var noBuf = !buf;
    var resize = noBuf || st.i != 2;
    var noSt = st.i;
    if (noBuf)
      buf = new u8(sl * 3);
    var cbuf = function(l2) {
      var bl = buf.length;
      if (l2 > bl) {
        var nbuf = new u8(Math.max(bl * 2, l2));
        nbuf.set(buf);
        buf = nbuf;
      }
    };
    var final = st.f || 0, pos = st.p || 0, bt = st.b || 0, lm = st.l, dm = st.d, lbt = st.m, dbt = st.n;
    var tbts = sl * 8;
    do {
      if (!lm) {
        final = bits(dat, pos, 1);
        var type = bits(dat, pos + 1, 3);
        pos += 3;
        if (!type) {
          var s = shft(pos) + 4, l = dat[s - 4] | dat[s - 3] << 8, t = s + l;
          if (t > sl) {
            if (noSt)
              err(0);
            break;
          }
          if (resize)
            cbuf(bt + l);
          buf.set(dat.subarray(s, t), bt);
          st.b = bt += l, st.p = pos = t * 8, st.f = final;
          continue;
        } else if (type == 1)
          lm = flrm, dm = fdrm, lbt = 9, dbt = 5;
        else if (type == 2) {
          var hLit = bits(dat, pos, 31) + 257, hcLen = bits(dat, pos + 10, 15) + 4;
          var tl = hLit + bits(dat, pos + 5, 31) + 1;
          pos += 14;
          var ldt = new u8(tl);
          var clt = new u8(19);
          for (var i = 0; i < hcLen; ++i) {
            clt[clim[i]] = bits(dat, pos + i * 3, 7);
          }
          pos += hcLen * 3;
          var clb = max(clt), clbmsk = (1 << clb) - 1;
          var clm = hMap(clt, clb, 1);
          for (var i = 0; i < tl; ) {
            var r = clm[bits(dat, pos, clbmsk)];
            pos += r & 15;
            var s = r >> 4;
            if (s < 16) {
              ldt[i++] = s;
            } else {
              var c = 0, n = 0;
              if (s == 16)
                n = 3 + bits(dat, pos, 3), pos += 2, c = ldt[i - 1];
              else if (s == 17)
                n = 3 + bits(dat, pos, 7), pos += 3;
              else if (s == 18)
                n = 11 + bits(dat, pos, 127), pos += 7;
              while (n--)
                ldt[i++] = c;
            }
          }
          var lt = ldt.subarray(0, hLit), dt = ldt.subarray(hLit);
          lbt = max(lt);
          dbt = max(dt);
          lm = hMap(lt, lbt, 1);
          dm = hMap(dt, dbt, 1);
        } else
          err(1);
        if (pos > tbts) {
          if (noSt)
            err(0);
          break;
        }
      }
      if (resize)
        cbuf(bt + 131072);
      var lms = (1 << lbt) - 1, dms = (1 << dbt) - 1;
      var lpos = pos;
      for (; ; lpos = pos) {
        var c = lm[bits16(dat, pos) & lms], sym = c >> 4;
        pos += c & 15;
        if (pos > tbts) {
          if (noSt)
            err(0);
          break;
        }
        if (!c)
          err(2);
        if (sym < 256)
          buf[bt++] = sym;
        else if (sym == 256) {
          lpos = pos, lm = null;
          break;
        } else {
          var add = sym - 254;
          if (sym > 264) {
            var i = sym - 257, b = fleb[i];
            add = bits(dat, pos, (1 << b) - 1) + fl[i];
            pos += b;
          }
          var d = dm[bits16(dat, pos) & dms], dsym = d >> 4;
          if (!d)
            err(3);
          pos += d & 15;
          var dt = fd[dsym];
          if (dsym > 3) {
            var b = fdeb[dsym];
            dt += bits16(dat, pos) & (1 << b) - 1, pos += b;
          }
          if (pos > tbts) {
            if (noSt)
              err(0);
            break;
          }
          if (resize)
            cbuf(bt + 131072);
          var end = bt + add;
          if (bt < dt) {
            var shift = dl - dt, dend = Math.min(dt, end);
            if (shift + bt < 0)
              err(3);
            for (; bt < dend; ++bt)
              buf[bt] = dict[shift + bt];
          }
          for (; bt < end; ++bt)
            buf[bt] = buf[bt - dt];
        }
      }
      st.l = lm, st.p = lpos, st.b = bt, st.f = final;
      if (lm)
        final = 1, st.m = lbt, st.d = dm, st.n = dbt;
    } while (!final);
    return bt != buf.length && noBuf ? slc(buf, 0, bt) : buf.subarray(0, bt);
  };
  var et = /* @__PURE__ */ new u8(0);
  var b2 = function(d, b) {
    return d[b] | d[b + 1] << 8;
  };
  var b4 = function(d, b) {
    return (d[b] | d[b + 1] << 8 | d[b + 2] << 16 | d[b + 3] << 24) >>> 0;
  };
  var b8 = function(d, b) {
    return b4(d, b) + b4(d, b + 4) * 4294967296;
  };
  function inflateSync(data, opts) {
    return inflt(data, { i: 2 }, opts && opts.out, opts && opts.dictionary);
  }
  var td = typeof TextDecoder != "undefined" && /* @__PURE__ */ new TextDecoder();
  var tds = 0;
  try {
    td.decode(et, { stream: true });
    tds = 1;
  } catch (e) {
  }
  var dutf8 = function(d) {
    for (var r = "", i = 0; ; ) {
      var c = d[i++];
      var eb = (c > 127) + (c > 223) + (c > 239);
      if (i + eb > d.length)
        return { s: r, r: slc(d, i - 1) };
      if (!eb)
        r += String.fromCharCode(c);
      else if (eb == 3) {
        c = ((c & 15) << 18 | (d[i++] & 63) << 12 | (d[i++] & 63) << 6 | d[i++] & 63) - 65536, r += String.fromCharCode(55296 | c >> 10, 56320 | c & 1023);
      } else if (eb & 1)
        r += String.fromCharCode((c & 31) << 6 | d[i++] & 63);
      else
        r += String.fromCharCode((c & 15) << 12 | (d[i++] & 63) << 6 | d[i++] & 63);
    }
  };
  function strFromU8(dat, latin1) {
    if (latin1) {
      var r = "";
      for (var i = 0; i < dat.length; i += 16384)
        r += String.fromCharCode.apply(null, dat.subarray(i, i + 16384));
      return r;
    } else if (td) {
      return td.decode(dat);
    } else {
      var _a2 = dutf8(dat), s = _a2.s, r = _a2.r;
      if (r.length)
        err(8);
      return s;
    }
  }
  var slzh = function(d, b) {
    return b + 30 + b2(d, b + 26) + b2(d, b + 28);
  };
  var zh = function(d, b, z) {
    var fnl = b2(d, b + 28), efl = b2(d, b + 30), fn = strFromU8(d.subarray(b + 46, b + 46 + fnl), !(b2(d, b + 8) & 2048)), es = b + 46 + fnl;
    var _a2 = z64hs(d, es, efl, z, b4(d, b + 20), b4(d, b + 24), b4(d, b + 42)), sc = _a2[0], su = _a2[1], off = _a2[2];
    return [b2(d, b + 10), sc, su, fn, es + efl + b2(d, b + 32), off];
  };
  var z64hs = function(d, b, l, z, sc, su, off) {
    var nsc = sc == 4294967295, nsu = su == 4294967295, noff = off == 4294967295, e = b + l;
    var nf = nsc + nsu + noff;
    if (z && nf) {
      for (; b + 4 < e; b += 4 + b2(d, b + 2)) {
        if (b2(d, b) == 1) {
          return [
            nsc ? b8(d, b + 4 + 8 * nsu) : sc,
            nsu ? b8(d, b + 4) : su,
            noff ? b8(d, b + 4 + 8 * (nsu + nsc)) : off,
            1
          ];
        }
      }
      if (z < 2)
        err(13);
    }
    return [sc, su, off, 0];
  };
  function unzipSync(data, opts) {
    var files = {};
    var e = data.length - 22;
    for (; b4(data, e) != 101010256; --e) {
      if (!e || data.length - e > 65558)
        err(13);
    }
    ;
    var c = b2(data, e + 8);
    if (!c)
      return {};
    var o = b4(data, e + 16);
    var z = b4(data, e - 20) == 117853008;
    if (z) {
      var ze = b4(data, e - 12);
      z = b4(data, ze) == 101075792;
      if (z) {
        c = b4(data, ze + 32);
        o = b4(data, ze + 48);
      }
    }
    var fltr = opts && opts.filter;
    for (var i = 0; i < c; ++i) {
      var _a2 = zh(data, o, z), c_2 = _a2[0], sc = _a2[1], su = _a2[2], fn = _a2[3], no = _a2[4], off = _a2[5], b = slzh(data, off);
      o = no;
      if (!fltr || fltr({
        name: fn,
        size: sc,
        originalSize: su,
        compression: c_2
      })) {
        if (!c_2)
          files[fn] = slc(data, b, b + sc);
        else if (c_2 == 8)
          files[fn] = inflateSync(data.subarray(b, b + sc), { out: new u8(su) });
        else
          err(14, "unknown compression type " + c_2);
      }
    }
    return files;
  }

  // scripts/local-game-archive.js
  var MAX_LOCAL_ZIP_BYTES = 10 * 1024 * 1024;
  var MAX_LOCAL_EXPANDED_BYTES = 32 * 1024 * 1024;
  var MAX_LOCAL_FILES = 750;
  function safeGamePath(name) {
    const normalized = name.replaceAll("\\", "/");
    if (!normalized || normalized.startsWith("/") || normalized.includes(":") || normalized.includes("\0") || normalized.split("/").some((part) => part === "." || part === "..")) {
      throw new Error("The ZIP contains an unsafe file path.");
    }
    return normalized;
  }
  function findGameEntry(filePaths) {
    return filePaths.filter((path) => /(^|\/)index\.html?$/i.test(path)).sort((left, right) => left.length - right.length)[0] || null;
  }
  function resolveGameAssetPath(reference, fromPath) {
    const value = reference.trim();
    if (!value || value.startsWith("#") || /^(?:[a-z][a-z\d+.-]*:|\/\/)/i.test(value)) {
      return null;
    }
    let pathname;
    try {
      pathname = decodeURIComponent(value.split(/[?#]/, 1)[0]).replaceAll("\\", "/");
    } catch {
      return null;
    }
    if (!pathname) return null;
    const segments = pathname.startsWith("/") ? [] : fromPath.split("/").slice(0, -1);
    for (const part of pathname.replace(/^\/+/, "").split("/")) {
      if (!part || part === ".") continue;
      if (part === "..") {
        if (!segments.length) return null;
        segments.pop();
        continue;
      }
      if (part.includes(":") || part.includes("\0")) return null;
      segments.push(part);
    }
    return segments.join("/");
  }
  function unpackLocalGame(zipBytes) {
    if (!(zipBytes instanceof Uint8Array) || zipBytes.byteLength === 0 || zipBytes.byteLength > MAX_LOCAL_ZIP_BYTES) {
      throw new Error("Choose a ZIP between 1 byte and 10 MB.");
    }
    let fileCount = 0;
    let expandedBytes = 0;
    const archive = unzipSync(zipBytes, {
      filter(file) {
        safeGamePath(file.name);
        if (!file.name.endsWith("/") && !file.name.endsWith("\\")) {
          fileCount += 1;
          const fileSize = Number(file.originalSize);
          if (!Number.isSafeInteger(fileSize) || fileSize < 0) {
            throw new Error("The ZIP contains an invalid file entry.");
          }
          const unixFileType = Number(file.attrs) >>> 16 & 61440;
          if (unixFileType === 40960) {
            throw new Error("The ZIP contains a symbolic link, which is not supported.");
          }
          expandedBytes += fileSize;
          if (fileCount > MAX_LOCAL_FILES) {
            throw new Error(`The ZIP contains more than ${MAX_LOCAL_FILES} files.`);
          }
          if (expandedBytes > MAX_LOCAL_EXPANDED_BYTES) {
            throw new Error("The extracted game exceeds the 32 MB local-play limit.");
          }
        }
        return true;
      }
    });
    const files = new Map(Object.entries(archive).map(([name, bytes]) => [safeGamePath(name), bytes]).filter(([name]) => !name.endsWith("/")));
    const entryPath = findGameEntry([...files.keys()]);
    if (!entryPath) {
      throw new Error("No index.html was found in the uploaded ZIP.");
    }
    return { entryPath, files };
  }

  // scripts/local-game-progress.js
  function createGDevelopProgressBridge(token) {
    return `(()=>{const token=${JSON.stringify(token)};const send=(type,percent,message)=>parent.postMessage({source:"gamesphere-local-game",token,type,percent,message},"*");const prototype=window.gdjs&&window.gdjs.RuntimeGame&&window.gdjs.RuntimeGame.prototype;if(!prototype||typeof prototype.loadAllAssets!=="function"||typeof prototype.loadFirstAssetsAndStartBackgroundLoading!=="function"){send("error",0,"This GDevelop export does not expose its startup loader.");return}const loadAllAssets=prototype.loadAllAssets;prototype.loadAllAssets=function(onComplete,onProgress){const complete=(...args)=>{send("complete",100,"Game resources loaded.");return typeof onComplete==="function"?onComplete.apply(this,args):undefined};const progress=percent=>{if(typeof onProgress==="function")onProgress.call(this,percent);if(Number.isFinite(percent))send("progress",Math.max(0,Math.min(100,Math.floor(percent))),percent>=100?"Finishing game libraries\u2026":"Loading game resources and extensions\u2026")};return loadAllAssets.call(this,complete,progress)};const loadFirstAssets=prototype.loadFirstAssetsAndStartBackgroundLoading;prototype.loadFirstAssetsAndStartBackgroundLoading=function(...args){const loading=loadFirstAssets.apply(this,args);if(loading&&typeof loading.catch==="function")loading.catch(error=>send("error",0,error&&error.message?String(error.message):"Game resources failed to load."));return loading}})();`;
  }

  // scripts/local-game-storage.js
  var STORAGE_DATABASE_NAME = "gamesphere-local-gdevelop-saves";
  var STORAGE_OBJECT_STORE = "records";
  async function createGameStorageNamespace(zipBytes) {
    if (globalThis.crypto?.subtle) {
      try {
        const digest = await globalThis.crypto.subtle.digest("SHA-256", zipBytes);
        return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
      } catch (error) {
        console.warn("Could not fingerprint the game ZIP with SHA-256:", error);
      }
    }
    let firstHash = 2166136261;
    let secondHash = 19088743;
    for (let index = 0; index < zipBytes.length; index += 1) {
      const byte = zipBytes[index];
      firstHash = Math.imul(firstHash ^ byte, 16777619);
      secondHash = Math.imul(secondHash ^ byte + index, 16777619);
    }
    return `${firstHash >>> 0}-${secondHash >>> 0}-${zipBytes.length}`;
  }
  function createGDevelopLocalStorageBridge(token, namespace, initialLocalStorage = {}, initializationError = "") {
    const encodedStorage = JSON.stringify(initialLocalStorage).replace(/</g, "\\u003c");
    const encodedInitializationError = JSON.stringify(initializationError).replace(/</g, "\\u003c");
    return `(()=> {
    const token=${JSON.stringify(token)};
    const namespace=${JSON.stringify(namespace)};
    let nextRequestId=0;
    const pending=new Map;
    const notifyStorageError=message=>parent.postMessage({source:"gamesphere-local-game",token,type:"storage-error",message},"*");
    window.addEventListener("message",event=>{
      if(event.source!==parent)return;
      const data=event.data;
      if(!data||data.source!=="gamesphere-local-game"||data.token!==token||data.type!=="storage-response")return;
      const task=pending.get(data.requestId);
      if(!task)return;
      pending.delete(data.requestId);
      if(data.error)task.reject(new Error(data.error));
      else task.resolve(data.result);
    });
    const request=(operation,databaseName,objectStoreName,key,value)=>new Promise((resolve,reject)=>{
      const requestId=++nextRequestId;
      pending.set(requestId,{resolve,reject});
      try{
        parent.postMessage({source:"gamesphere-local-game",token,type:"storage-request",namespace,requestId,operation,databaseName,objectStoreName,key,value},"*");
      }catch(error){
        pending.delete(requestId);
        reject(error);
      }
    });
    const values=new Map(Object.entries(${encodedStorage}));
    const localStorage={
      get length(){return values.size},
      key(index){return [...values.keys()][Number(index)]??null},
      getItem(key){const value=values.get(String(key));return value===undefined?null:value},
      setItem(key,value){
        key=String(key);
        value=String(value);
        values.set(key,value);
        request("save","gamesphere-gdevelop-local-storage","local-storage",key,value).catch(()=>{});
      },
      removeItem(key){
        key=String(key);
        values.delete(key);
        request("delete","gamesphere-gdevelop-local-storage","local-storage",key).catch(()=>{});
      },
      clear(){
        for(const key of values.keys()){
          request("delete","gamesphere-gdevelop-local-storage","local-storage",key).catch(()=>{});
        }
        values.clear();
      }
    };
    try{
      Object.defineProperty(window,"localStorage",{configurable:true,enumerable:true,writable:true,value:localStorage});
    }catch(error){
      notifyStorageError("This browser blocked the local save-storage bridge.");
    }
    const bridge={
      request,
      bindIndexedDB(){
        const storage=window.gdjs&&window.gdjs.indexedDb;
        if(!storage)return;
        storage.saveToIndexedDB=(databaseName,objectStoreName,key,value)=>request("save",databaseName,objectStoreName,key,value);
        storage.loadFromIndexedDB=(databaseName,objectStoreName,key)=>request("load",databaseName,objectStoreName,key);
        storage.deleteFromIndexedDB=(databaseName,objectStoreName,key)=>request("delete",databaseName,objectStoreName,key);
        storage.keyExistsInIndexedDB=(databaseName,objectStoreName,key)=>request("exists",databaseName,objectStoreName,key);
        storage.getAllKeysFromIndexedDB=(databaseName,objectStoreName)=>request("list-keys",databaseName,objectStoreName);
        storage.getAllFromIndexedDB=(databaseName,objectStoreName)=>request("list-values",databaseName,objectStoreName);
      }
    };
    Object.defineProperty(window,"__gamesphereGDevelopStorageBridge",{configurable:false,value:bridge});
    if(${encodedInitializationError})notifyStorageError("GDevelop saves could not be loaded: "+${encodedInitializationError});
  })();`;
  }
  function createGDevelopStorageBridge() {
    return `(()=>{window.__gamesphereGDevelopStorageBridge?.bindIndexedDB()})();`;
  }
  function openStorageDatabase(indexedDB) {
    if (!indexedDB) {
      return Promise.reject(new Error("This browser does not provide IndexedDB."));
    }
    return new Promise((resolve, reject) => {
      let request;
      let blocked = false;
      try {
        request = indexedDB.open(STORAGE_DATABASE_NAME, 1);
      } catch (error) {
        reject(error);
        return;
      }
      request.onupgradeneeded = () => {
        const database = request.result;
        if (!database.objectStoreNames.contains(STORAGE_OBJECT_STORE)) {
          const store = database.createObjectStore(STORAGE_OBJECT_STORE, { keyPath: "id" });
          store.createIndex("scope", "scope", { unique: false });
        }
      };
      request.onsuccess = () => {
        if (blocked) {
          request.result.close();
        } else {
          resolve(request.result);
        }
      };
      request.onerror = () => reject(request.error || new Error("Could not open local game save storage."));
      request.onblocked = () => {
        blocked = true;
        reject(new Error("Local game save storage is blocked by another open page."));
      };
    });
  }
  function runStorageTransaction(database, mode, operation) {
    return new Promise((resolve, reject) => {
      let transaction;
      try {
        transaction = database.transaction(STORAGE_OBJECT_STORE, mode);
      } catch (error) {
        database.close();
        reject(error);
        return;
      }
      let result;
      let settled = false;
      const fail = (error) => {
        if (settled) return;
        settled = true;
        database.close();
        reject(error);
      };
      transaction.oncomplete = () => {
        if (settled) return;
        settled = true;
        database.close();
        resolve(result);
      };
      transaction.onabort = () => fail(transaction.error || new Error("Local game save transaction was aborted."));
      transaction.onerror = () => fail(transaction.error || new Error("Local game save transaction failed."));
      try {
        const request = operation(transaction.objectStore(STORAGE_OBJECT_STORE));
        if (request) {
          request.onsuccess = () => {
            result = request.result;
          };
          request.onerror = () => fail(request.error || new Error("Local game save request failed."));
        }
      } catch (error) {
        try {
          transaction.abort();
        } catch {
          fail(error);
        }
      }
    });
  }
  async function handleGDevelopStorageRequest(request, namespace, indexedDB = globalThis.indexedDB) {
    if (!request || request.namespace !== namespace) {
      throw new Error("The game save request has an invalid storage namespace.");
    }
    const { operation, databaseName, objectStoreName, key, value } = request;
    if (typeof databaseName !== "string" || databaseName.length > 512 || typeof objectStoreName !== "string" || objectStoreName.length > 512) {
      throw new Error("The game save request has an invalid database or store name.");
    }
    if (operation !== "list-keys" && operation !== "list-values" && (typeof key !== "string" || key.length > 2048)) {
      throw new Error("The game save request has an invalid save key.");
    }
    if (!["save", "load", "delete", "exists", "list-keys", "list-values"].includes(operation)) {
      throw new Error("The game requested an unsupported save-storage operation.");
    }
    const scope = JSON.stringify([namespace, databaseName, objectStoreName]);
    const id = key === void 0 ? null : JSON.stringify([scope, key]);
    const database = await openStorageDatabase(indexedDB);
    try {
      switch (operation) {
        case "save":
          return await runStorageTransaction(
            database,
            "readwrite",
            (store) => store.put({ id, scope, key, value })
          );
        case "load":
          return await runStorageTransaction(database, "readonly", (store) => {
            const result = store.get(id);
            return result;
          }).then((record) => record ? record.value : null);
        case "delete":
          return await runStorageTransaction(database, "readwrite", (store) => store.delete(id));
        case "exists":
          return await runStorageTransaction(database, "readonly", (store) => store.count(id)).then((count) => count > 0);
        case "list-keys":
          return await runStorageTransaction(
            database,
            "readonly",
            (store) => store.index("scope").getAll(scope)
          ).then((records) => records.map((record) => record.key));
        case "list-values":
          return await runStorageTransaction(
            database,
            "readonly",
            (store) => store.index("scope").getAll(scope)
          ).then((records) => records.map((record) => ({ key: record.key, value: record.value })));
        default:
          throw new Error("The game requested an unsupported save-storage operation.");
      }
    } catch (error) {
      database.close();
      throw error;
    }
  }

  // scripts/local-game.js
  var MIME_TYPES = {
    css: "text/css",
    csv: "text/csv",
    gif: "image/gif",
    html: "text/html",
    jpeg: "image/jpeg",
    jpg: "image/jpeg",
    js: "text/javascript",
    json: "application/json",
    m4a: "audio/mp4",
    mp3: "audio/mpeg",
    mp4: "video/mp4",
    ogg: "audio/ogg",
    otf: "font/otf",
    png: "image/png",
    svg: "image/svg+xml",
    ttf: "font/ttf",
    txt: "text/plain",
    wav: "audio/wav",
    webm: "video/webm",
    webp: "image/webp",
    woff: "font/woff",
    woff2: "font/woff2",
    xml: "application/xml",
    wasm: "application/wasm"
  };
  window.GameSphereLocalGames = Object.freeze({
    isAvailable: true
  });
  function mimeType(path) {
    const extension = path.split(".").pop()?.toLowerCase();
    return MIME_TYPES[extension] || "application/octet-stream";
  }
  function toDataUrl(path, bytes) {
    let binary = "";
    const chunkSize = 32768;
    for (let offset = 0; offset < bytes.length; offset += chunkSize) {
      binary += String.fromCharCode(...bytes.subarray(offset, offset + chunkSize));
    }
    return `data:${mimeType(path)};base64,${btoa(binary)}`;
  }
  function preserveSuffix(originalReference, mappedUrl) {
    const suffixIndex = originalReference.search(/[?#]/);
    return suffixIndex < 0 ? mappedUrl : `${mappedUrl}${originalReference.slice(suffixIndex)}`;
  }
  function rewriteCss(css, currentPath, fileUrls) {
    return css.replace(/url\(\s*(["']?)(.*?)\1\s*\)/gi, (match, quote, reference) => {
      const assetPath = resolveGameAssetPath(reference, currentPath);
      const mapped = assetPath && fileUrls.get(assetPath);
      return mapped ? `url("${preserveSuffix(reference, mapped)}")` : match;
    });
  }
  function createRuntimeBridge(assetMap) {
    const encodedAssetMap = JSON.stringify(assetMap).replace(/</g, "\\u003c");
    return `<script>(()=>{const assets=${encodedAssetMap};const base=new URL(document.baseURI);const resolve=value=>{try{const url=new URL(typeof value==="string"?value:value.url,base);if(url.origin!==base.origin)return null;const key=decodeURIComponent(url.pathname).replace(/^\\/+|\\/$/g,"");return assets[key]||null}catch{return null}};const fetchOriginal=window.fetch.bind(window);window.fetch=(input,init)=>{const mapped=resolve(input);return fetchOriginal(mapped||input,init)};const openOriginal=XMLHttpRequest.prototype.open;XMLHttpRequest.prototype.open=function(method,url,...rest){return openOriginal.call(this,method,resolve(url)||url,...rest)};const setOriginal=Element.prototype.setAttribute;Element.prototype.setAttribute=function(name,value){if(["src","href","poster","data","xlink:href"].includes(String(name).toLowerCase())){const mapped=resolve(value);if(mapped)value=mapped}return setOriginal.call(this,name,value)};for(const type of [window.HTMLImageElement,window.HTMLScriptElement,window.HTMLMediaElement,window.HTMLAudioElement,window.HTMLVideoElement,window.HTMLSourceElement,window.HTMLTrackElement,window.HTMLIFrameElement,window.HTMLLinkElement]){const descriptor=type&&Object.getOwnPropertyDescriptor(type.prototype,"src")||type&&Object.getOwnPropertyDescriptor(type.prototype,"href");if(!descriptor||!descriptor.set||!descriptor.get)continue;const key=Object.prototype.hasOwnProperty.call(type.prototype,"src")?"src":"href";Object.defineProperty(type.prototype,key,{configurable:descriptor.configurable,enumerable:descriptor.enumerable,get:descriptor.get,set(value){return descriptor.set.call(this,resolve(value)||value)}})}})();<\/script>`;
  }
  function createDocumentReadyBridge(token) {
    return `<script>window.addEventListener("load",()=>parent.postMessage({source:"gamesphere-local-game",token:${JSON.stringify(token)},type:"document-ready"},"*"),{once:true});<\/script>`;
  }
  async function createGameDocument(entryPath, files, progressToken, storageNamespace) {
    const entry = files.get(entryPath);
    if (!entry) throw new Error("The game's entry page could not be read.");
    const fileUrls = /* @__PURE__ */ new Map();
    for (const [path, bytes] of files) {
      fileUrls.set(path, toDataUrl(path, bytes));
    }
    const html = new TextDecoder().decode(entry);
    const parsed = new DOMParser().parseFromString(html, "text/html");
    parsed.querySelectorAll("base").forEach((base2) => base2.remove());
    const base = parsed.createElement("base");
    base.href = `https://gamesphere-local.invalid/${entryPath.split("/").map(encodeURIComponent).join("/")}`;
    parsed.head.prepend(base);
    const startupScript = [...parsed.querySelectorAll("script:not([src])")].find((script) => /loadAllAssets/.test(script.textContent) && /startGameLoop/.test(script.textContent));
    let initialLocalStorage = {};
    let storageInitializationError = "";
    if (startupScript) {
      try {
        const savedEntries = await handleGDevelopStorageRequest({
          namespace: storageNamespace,
          operation: "list-values",
          databaseName: "gamesphere-gdevelop-local-storage",
          objectStoreName: "local-storage"
        }, storageNamespace);
        initialLocalStorage = Object.fromEntries(savedEntries.filter((entry2) => typeof entry2.key === "string" && typeof entry2.value === "string").map((entry2) => [entry2.key, entry2.value]));
      } catch (error) {
        console.error("Could not load GDevelop localStorage saves:", error);
        storageInitializationError = error.message;
      }
      const storageBridge = parsed.createElement("script");
      storageBridge.textContent = createGDevelopLocalStorageBridge(
        progressToken,
        storageNamespace,
        initialLocalStorage,
        storageInitializationError
      );
      const firstHeadScript = parsed.head.querySelector("script");
      if (firstHeadScript) {
        parsed.head.insertBefore(storageBridge, firstHeadScript);
      } else {
        parsed.head.append(storageBridge);
      }
      startupScript.textContent = `${createGDevelopStorageBridge()}
${createGDevelopProgressBridge(progressToken)}
${startupScript.textContent}`;
    }
    parsed.querySelectorAll("link[rel~='stylesheet'][href]").forEach((link) => {
      const reference = link.getAttribute("href");
      const cssPath = resolveGameAssetPath(reference, entryPath);
      const cssFile = cssPath && files.get(cssPath);
      if (!cssFile) return;
      const style = parsed.createElement("style");
      style.textContent = rewriteCss(new TextDecoder().decode(cssFile), cssPath, fileUrls);
      link.replaceWith(style);
    });
    for (const attribute of ["src", "href", "poster", "data"]) {
      parsed.querySelectorAll(`[${attribute}]`).forEach((element) => {
        const value = element.getAttribute(attribute);
        const assetPath = resolveGameAssetPath(value, entryPath);
        const mapped = assetPath && fileUrls.get(assetPath);
        if (mapped) element.setAttribute(attribute, preserveSuffix(value, mapped));
      });
    }
    parsed.querySelectorAll("*").forEach((element) => {
      if (!element.hasAttributeNS("http://www.w3.org/1999/xlink", "href")) return;
      const reference = element.getAttributeNS("http://www.w3.org/1999/xlink", "href");
      const assetPath = resolveGameAssetPath(reference, entryPath);
      const mapped = assetPath && fileUrls.get(assetPath);
      if (mapped) {
        element.setAttributeNS(
          "http://www.w3.org/1999/xlink",
          "xlink:href",
          preserveSuffix(reference, mapped)
        );
      }
    });
    parsed.querySelectorAll("[srcset]").forEach((element) => {
      const value = element.getAttribute("srcset");
      const rewritten = value.replace(/(^|,\s*)([^,\s]+)(\s+[^,]+)?/g, (match, prefix, reference, descriptor = "") => {
        const assetPath = resolveGameAssetPath(reference, entryPath);
        const mapped = assetPath && fileUrls.get(assetPath);
        return mapped ? `${prefix}${preserveSuffix(reference, mapped)}${descriptor}` : match;
      });
      element.setAttribute("srcset", rewritten);
    });
    parsed.querySelectorAll("style").forEach((style) => {
      style.textContent = rewriteCss(style.textContent, entryPath, fileUrls);
    });
    parsed.querySelectorAll("[style]").forEach((element) => {
      element.setAttribute("style", rewriteCss(element.getAttribute("style"), entryPath, fileUrls));
    });
    const policy = parsed.createElement("meta");
    policy.httpEquiv = "Content-Security-Policy";
    policy.content = "default-src data: blob: https: 'unsafe-inline' 'unsafe-eval'; img-src data: blob: https:; media-src data: blob: https:; font-src data: blob: https:; style-src data: blob: https: 'unsafe-inline'; script-src data: blob: https: 'unsafe-inline' 'unsafe-eval' 'wasm-unsafe-eval'; connect-src data: blob: https:; worker-src data: blob: https:; frame-src data: blob: https:";
    parsed.head.prepend(policy);
    parsed.body.prepend(parsed.createRange().createContextualFragment(
      `${createRuntimeBridge(Object.fromEntries(fileUrls))}${createDocumentReadyBridge(progressToken)}`
    ));
    return {
      html: `<!doctype html>
${parsed.documentElement.outerHTML}`,
      tracksProgress: Boolean(startupScript)
    };
  }
  async function readZipBytes(file) {
    if (!(file instanceof File) || file.size === 0 || file.size > MAX_LOCAL_ZIP_BYTES) {
      throw new Error("Choose a non-empty game ZIP no larger than 10 MB.");
    }
    return new Uint8Array(await file.arrayBuffer());
  }
  function initLocalGamePlayer() {
    const fileInput = document.getElementById("game-zip-input");
    const playButton = document.getElementById("local-play-button");
    const modal = document.getElementById("local-game-modal");
    const frame = document.getElementById("local-game-frame");
    const title = document.getElementById("local-game-title");
    const closeButton = document.getElementById("local-game-close");
    const fullscreenButton = document.getElementById("local-game-fullscreen");
    const loading = document.getElementById("local-game-loading");
    const loadingTitle = document.getElementById("local-game-loading-title");
    const loadingPercent = document.getElementById("local-game-loading-percent");
    const loadingTrack = document.getElementById("local-game-loading-track");
    const loadingProgress = document.getElementById("local-game-loading-progress");
    const loadingMessage = document.getElementById("local-game-loading-message");
    if (!fileInput || !playButton || !modal || !frame || !title || !closeButton || !fullscreenButton || !loading || !loadingTitle || !loadingPercent || !loadingTrack || !loadingProgress || !loadingMessage) return;
    let activeToken = null;
    let activeStorageNamespace = null;
    let storageErrorReported = false;
    const storageOperations = /* @__PURE__ */ new Set();
    let lastStorageActivity = 0;
    let isClosing = false;
    let tracksProgress = false;
    function updateFullscreenButton() {
      const isFullscreen = document.fullscreenElement === frame;
      fullscreenButton.textContent = isFullscreen ? "\u26F6 Exit full screen" : "\u26F6 Full screen";
      fullscreenButton.setAttribute("aria-label", isFullscreen ? "Exit full screen" : "Enter full screen");
      fullscreenButton.setAttribute("aria-pressed", String(isFullscreen));
    }
    async function toggleFullscreen() {
      try {
        if (document.fullscreenElement === frame) {
          await document.exitFullscreen();
        } else {
          if (typeof frame.requestFullscreen !== "function") {
            throw new Error("Fullscreen is not supported by this browser.");
          }
          await frame.requestFullscreen();
        }
        updateFullscreenButton();
      } catch (error) {
        console.error("Could not change game fullscreen state:", error);
        window.GameSphereShowToast?.(`Could not change full screen: ${error.message}`);
      }
    }
    function updateProgress(percent, message) {
      const safePercent = Math.max(0, Math.min(100, Math.floor(percent)));
      loadingPercent.textContent = `${safePercent}%`;
      loadingTrack.setAttribute("aria-valuenow", String(safePercent));
      loadingProgress.style.width = `${safePercent}%`;
      loadingMessage.textContent = message;
      loadingMessage.classList.remove("game-loading-error");
    }
    function finishLoading() {
      updateProgress(100, "Game resources loaded. Starting game\u2026");
      loading.hidden = true;
    }
    function failLoading(message) {
      loadingTitle.textContent = "Game could not finish loading";
      loadingMessage.textContent = message;
      loadingMessage.classList.add("game-loading-error");
      loadingTrack.hidden = true;
      loadingPercent.hidden = true;
    }
    window.addEventListener("message", (event) => {
      if (event.source !== frame.contentWindow) return;
      const data = event.data;
      if (!data || data.source !== "gamesphere-local-game" || data.token !== activeToken || typeof data.type !== "string") return;
      if (data.type === "storage-request") {
        if (!activeStorageNamespace || !Number.isSafeInteger(data.requestId)) return;
        lastStorageActivity = Date.now();
        const storageOperation = handleGDevelopStorageRequest(data, activeStorageNamespace);
        storageOperations.add(storageOperation);
        storageOperation.then((result) => {
          frame.contentWindow.postMessage({
            source: "gamesphere-local-game",
            token: data.token,
            type: "storage-response",
            requestId: data.requestId,
            result
          }, "*");
        }).catch((error) => {
          console.error("Could not access local GDevelop save storage:", error);
          if (!storageErrorReported) {
            storageErrorReported = true;
            window.GameSphereShowToast?.(`Game save storage is unavailable: ${error.message}`);
          }
          frame.contentWindow.postMessage({
            source: "gamesphere-local-game",
            token: data.token,
            type: "storage-response",
            requestId: data.requestId,
            error: error.message
          }, "*");
        }).finally(() => storageOperations.delete(storageOperation));
      } else if (data.type === "storage-error") {
        if (!storageErrorReported) {
          storageErrorReported = true;
          window.GameSphereShowToast?.(typeof data.message === "string" ? data.message : "Game save storage is unavailable.");
        }
      } else if (data.type === "progress" && Number.isFinite(data.percent)) {
        updateProgress(data.percent, typeof data.message === "string" ? data.message : "Loading game resources and extensions\u2026");
      } else if (data.type === "complete") {
        finishLoading();
      } else if (data.type === "document-ready") {
        if (tracksProgress) {
          loadingMessage.textContent = "Loading game resources and extensions\u2026";
        } else {
          finishLoading();
        }
      } else if (data.type === "error") {
        failLoading(typeof data.message === "string" ? data.message : "A game resource failed to load.");
      }
    });
    playButton.addEventListener("click", async () => {
      const file = fileInput.files?.[0];
      if (!file) {
        window.GameSphereShowToast?.("Choose an HTML5 game ZIP first.");
        return;
      }
      const token = window.crypto.randomUUID();
      activeToken = token;
      playButton.disabled = true;
      playButton.textContent = "Preparing game\u2026";
      title.textContent = file.name.replace(/\.[^.]+$/, "") || "Game";
      loading.hidden = false;
      loadingTitle.textContent = "Preparing game";
      loadingTrack.hidden = false;
      loadingPercent.hidden = false;
      updateProgress(0, "Reading the selected game ZIP\u2026");
      modal.hidden = false;
      document.body.classList.add("local-game-open");
      try {
        const zipBytes = await readZipBytes(file);
        updateProgress(0, "Extracting game files\u2026");
        await new Promise((resolve) => window.setTimeout(resolve, 0));
        const { entryPath, files } = unpackLocalGame(zipBytes);
        const storageNamespace = await createGameStorageNamespace(zipBytes);
        updateProgress(0, "Preparing game resources\u2026");
        const gameDocument = await createGameDocument(entryPath, files, token, storageNamespace);
        tracksProgress = gameDocument.tracksProgress;
        activeStorageNamespace = storageNamespace;
        storageErrorReported = false;
        loadingTitle.textContent = tracksProgress ? "Loading game resources" : "Starting game";
        loadingMessage.textContent = tracksProgress ? "Waiting for the game resource loader\u2026" : "Opening the game\u2026";
        frame.srcdoc = gameDocument.html;
        closeButton.focus();
      } catch (error) {
        activeStorageNamespace = null;
        console.error("Could not launch local game:", error);
        failLoading(`Could not open this game: ${error.message}`);
      } finally {
        playButton.disabled = false;
        playButton.textContent = "Play locally";
      }
    });
    async function closeGame() {
      if (isClosing) return;
      isClosing = true;
      const closeButtonLabel = closeButton.textContent;
      closeButton.disabled = true;
      closeButton.textContent = "Saving\u2026";
      const flushStarted = Date.now();
      lastStorageActivity = Date.now();
      do {
        await new Promise((resolve) => window.setTimeout(resolve, 25));
        const pending = [...storageOperations];
        if (pending.length) await Promise.allSettled(pending);
      } while (Date.now() - lastStorageActivity < 75 && Date.now() - flushStarted < 2e3);
      activeToken = null;
      activeStorageNamespace = null;
      modal.hidden = true;
      frame.srcdoc = "";
      loading.hidden = false;
      loadingTrack.hidden = false;
      loadingPercent.hidden = false;
      loadingTitle.textContent = "Loading game";
      updateProgress(0, "Preparing game ZIP\u2026");
      document.body.classList.remove("local-game-open");
      closeButton.disabled = false;
      closeButton.textContent = closeButtonLabel;
      isClosing = false;
      playButton.focus();
    }
    closeButton.addEventListener("click", closeGame);
    fullscreenButton.addEventListener("click", toggleFullscreen);
    document.addEventListener("fullscreenchange", updateFullscreenButton);
    modal.addEventListener("click", (event) => {
      if (event.target === modal) closeGame();
    });
    document.addEventListener("keydown", (event) => {
      if (event.key !== "Escape" || modal.hidden) return;
      if (document.fullscreenElement === frame) {
        event.preventDefault();
        document.exitFullscreen().catch((error) => {
          console.error("Could not exit game fullscreen:", error);
          window.GameSphereShowToast?.(`Could not exit full screen: ${error.message}`);
        }).then(updateFullscreenButton);
      } else {
        closeGame();
      }
    });
    updateFullscreenButton();
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initLocalGamePlayer, { once: true });
  } else {
    initLocalGamePlayer();
  }
})();
