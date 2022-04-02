simRace = 8;
commonTech(true);
addDesign("Pl21 Probe",true,0,20,false);
addDesign("Ru25 Gunboat",true,0,0,false);
addDesign("Ru25 Gunboats",true,600,10,false);
addDesign("Ru30 Gunboats",true,750,25,false);
addDesign("Mig Class Scout",true,0,0,false);
addDesign("Mig Class Transport",true,500,0,false);
addDesign("Moscow Class Star Escort",true,0,0,false);
addDesign("Moscow Class Star Destroyer",true,2850,0,false);
addDesign("Aries Class Transport",true,650,20,false);
addDesign("Super Star Carrier",true,0,0,false);
addDesign("Super Star Carrier II",true,3200,10,false);
addDesign("Super Star Destroyer",true,0,60,false);
addDesign("Super Star Cruiser",true,0,0,false);
addDesign("Super Star Cruiser II",true,4900,10,false);
addDesign("Gorbie Class Battlecarrier",true,0,60,false);

addDesign("Dark Sense",false,0,70,true);
addDesign("5 Free Starbase Fighters",false,0,50,false);
addDesign("Starbase Mine Sweeping",false,3150,15,false);
addDesign("Starbase Fighter Sweeping",false,3800,25,false);
addDesign("Destroy Planet",false,3100,20,false);
addDesign("Debris Disk Defense",false,0,10,true);
cloneShips();
for (i = 1; i < 5; i++) {
    addDesign(i+" Free Starbase Fighters",false,1000*i,10*i,false);
}
addDesign("Dark Detection",false,2210,25,false);
addDesign("Galactic Power",false,0,20,false);
addDesign("Starbase Fighter Transfer",false,0,30,false);
//addDesign("Fighter Patrol Routes",false,5890,60,false);
