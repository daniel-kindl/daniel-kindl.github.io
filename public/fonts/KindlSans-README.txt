Kindl Sans
==========

Kindl Sans (KindlSans-VariableFont_wght.woff2) is a Modified Version of
IBM Plex Sans 3.201 by IBM Corp., under the SIL Open Font License 1.1.
The license text and the upstream copyright line are in KindlSans-OFL.txt.

IBM Plex Sans has the Reserved Font Name "Plex". OFL 1.1 clause 3 does not
let a Modified Version use a Reserved Font Name as its primary font name.
This file is a subset, so it has a new name.

Source
------

- Font: IBM Plex Sans, "Version 3.201", from the file
  IBMPlexSans-VariableFont_wdth,wght.woff2 as it was at commit c41b1f1 of
  this repository (sha256
  e91ac642997295627393490c9723698b376cd0873e5feb63eca7ff16cf220ed8).
- Commit 34009cc made that subset: 146 glyphs, 102 code points, the wght
  axis 400 to 700. No script records the subset command.
- License: googlefonts/plex LICENSE.txt, commit
  3e312890b3b9e47378b30dedfe4196a42151243c (CRLF changed to LF).

Rename step
-----------

The rename changes only the name table. It keeps the copyright record
(name ID 0). It keeps the head timestamp. The glyphs, axes and other tables
do not change. It needs Python 3 with fontTools 4.65.0 and brotli 1.2.1, run
once. They are not project dependencies.

  python3 -m venv /tmp/ft && /tmp/ft/bin/pip install fonttools==4.65.0 brotli==1.2.1
  git show 'c41b1f1:public/fonts/IBMPlexSans-VariableFont_wdth,wght.woff2' \
    > 'IBMPlexSans-VariableFont_wdth,wght.woff2'
  /tmp/ft/bin/python3 - <<'PY'
  from fontTools.ttLib import TTFont

  font = TTFont("IBMPlexSans-VariableFont_wdth,wght.woff2", recalcTimestamp=False)
  for record in font["name"].names:
      if record.nameID == 0:
          continue  # keep the copyright notice
      record.string = (
          record.toUnicode()
          .replace("IBM;IBMPlexSans", "KindlSans")
          .replace("IBM Plex Sans", "Kindl Sans")
          .replace("IBMPlexSans", "KindlSans")
      )
  font.save("KindlSans-VariableFont_wght.woff2")
  PY

Result: 25384 bytes, sha256
261d42cd6712b11f7fd3a8508b0a705ca5d65df489f2e819b1ef64ac3218167e.
test/font-names.test.mjs checks the name table, the CSS, the preload links
and the file names.
