from PIL import Image, ImageDraw, ImageFont
from pathlib import Path
import subprocess, math
ROOT=Path(__file__).parent/'docs'
PAPER='#f6f4ec'; INK='#1d251d'; ACID='#eeff59'
BOLD='/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'
MONO='/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf'
def font(n,mono=False):return ImageFont.truetype(MONO if mono else BOLD,n)
def text(d,xy,s,n=45,fill=INK,width=None,mono=False):
 f=font(n,mono)
 while width and d.textlength(s,font=f)>width:n-=1;f=font(n,mono)
 d.text(xy,s,font=f,fill=fill)
def poster(w,h,vertical=False):
 im=Image.new('RGB',(w,h),PAPER);d=ImageDraw.Draw(im);m=65
 text(d,(m,45),'HUMAN, UNTIL.',30);d.line((m,100,w-m,100),fill=INK,width=2)
 if vertical:
  text(d,(m,145),'SAME MONEY. DIFFERENT PRIORITIES.',23,mono=True,width=w-2*m)
  text(d,(m,280),'$100.',175,width=w-2*m)
  text(d,(m,510),'Four choices.',110,width=w-2*m)
  d.rectangle((m-8,675,w-m,825),fill=ACID);text(d,(m,675),'Your line.',120,width=w-2*m)
  text(d,(m,1000),'HUMAN',35);text(d,(620,1000),'AI',35)
  text(d,(m,1060),'$45',110);text(d,(620,1060),'$5',110)
  text(d,(m,1300),'What would your',64,width=w-2*m)
  text(d,(m,1385),'friend choose?',64,width=w-2*m)
  text(d,(m,h-250),'PLAY FIRST. COMPARE RECEIPTS.',27,mono=True,width=w-2*m)
  d.rectangle((0,h-150,w,h),fill=INK)
  text(d,(m,h-110),'shemyakovcapt-beep.github.io/human-until',24,ACID,width=w-2*m,mono=True)
  text(d,(m,h-65),'FICTIONAL CHOICES. REAL QUESTIONS.',18,PAPER,mono=True)
 else:
  text(d,(m,165),'$100. Four choices.',94,width=w-2*m)
  d.rectangle((m-8,305,w-m,425),fill=ACID);text(d,(m,305),'Where’s your line?',94,width=w-2*m)
  text(d,(m,510),'PLAY FIRST. COMPARE WITH A FRIEND.',24,mono=True,width=w-2*m)
  text(d,(m,565),'HUMAN / AI / DO IT YOURSELF',17,mono=True)
 return im
poster(1200,630).save(ROOT/'social.png',optimize=True)
poster(1080,1920,True).save(ROOT/'story.png',optimize=True)
im=Image.new('RGB',(630,500),ACID);d=ImageDraw.Draw(im)
text(d,(35,30),'HUMAN, UNTIL.',25);text(d,(35,125),'$100.',120);text(d,(35,280),'Four choices.',61,width=560);text(d,(35,395),'WHERE’S YOUR LINE?',24,mono=True);im.save(ROOT/'itch-cover.png',optimize=True)
# Exact original typographic motion graphics, not fabricated gameplay footage.
W,H,FPS=1080,1920,24
scenes=[
(['$100.','Four choices.'],['What matters most?']),
(['HUMAN $45','AI $5'],['Or do it yourself.']),
(['Then it’s','YOUR','invoice.'],['Same decision. Different side.']),
(['Your friend.','Same $100.'],['Where do you disagree?']),
(['Play first.','Compare','receipts.'],['HUMAN, UNTIL.'])]
proc=subprocess.Popen(['ffmpeg','-hide_banner','-loglevel','error','-y','-f','rawvideo','-vcodec','rawvideo','-pix_fmt','rgb24','-s',f'{W}x{H}','-r',str(FPS),'-i','-','-an','-c:v','libx264','-preset','fast','-crf','24','-pix_fmt','yuv420p','-movflags','+faststart',str(ROOT/'teaser.mp4')],stdin=subprocess.PIPE)
for scene,(lines,sub) in enumerate(scenes):
 dark=scene==2;bg=INK if dark else PAPER;fg=PAPER if dark else INK
 for frame in range(FPS*3):
  im=Image.new('RGB',(W,H),bg);d=ImageDraw.Draw(im)
  text(d,(70,85),'HUMAN, UNTIL.',31,ACID if dark else INK)
  d.line((70,150,1010,150),fill=ACID if dark else INK,width=2)
  t=frame/FPS;slide=round(35*max(0,1-t/.35)**2)
  y=460+slide
  for j,line in enumerate(lines):
   highlight=(scene==0 and j==0) or (scene==2 and j==1) or (scene==4 and j==1)
   if highlight:d.rectangle((62,y-4,1015,y+151),fill=ACID)
   text(d,(75,y),line,120,INK if highlight else fg,width=930)
   y+=165
  text(d,(75,1180),sub[0],48,fg,width=925)
  text(d,(75,1440),'FICTIONAL CHOICES. REAL QUESTIONS.',23,fg,width=925,mono=True)
  text(d,(75,1690),'shemyakovcapt-beep.github.io/human-until',25,fg,width=925,mono=True)
  d.rectangle((70,1810,1010,1818),fill='#66705a' if dark else '#d3d7c9')
  d.rectangle((70,1810,70+int(940*((scene*3+t)/15)),1818),fill=ACID if dark else INK)
  proc.stdin.write(im.tobytes())
proc.stdin.close();code=proc.wait()
if code:raise RuntimeError('Video encoding failed')
print('Created landscape, story, game cover, and 15-second 1080x1920 MP4 teaser.')

