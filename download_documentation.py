from tqdm import tqdm
import os
import shutil
import subprocess
import urllib.request

path_to_7z = r'C:\Program Files\7-Zip\7z.exe'
versions = []

with open("versions.txt") as versions_file:
	for line in versions_file:
		versions.append(line.rstrip())

for version in tqdm(versions, desc="Downloading"):
	if os.path.isfile(f"tmp/{version}.dmg"):
		continue
	urllib.request.urlretrieve(f"http://download.unity3d.com/download_unity/{version}.dmg", f"tmp/{version}.dmg")

for version in tqdm(versions, desc="Extracting dmgs..."):
	dmgpath = os.path.abspath(f"tmp/{version}.dmg")
	outpath = os.path.abspath(f"tmp/{version}")

	if os.path.isdir(outpath):
		continue

	os.makedirs(outpath)
	subprocess.run(path_to_7z + " x " + dmgpath + " -o" + outpath, 
		stdout=subprocess.DEVNULL,
    	stderr=subprocess.STDOUT)

for version in tqdm(versions, desc="Extracting paks"):
	if "iphone" in version:
		root = "unity_iphone"
		name = "Unity iPhone"
	else:
		root = "unity"
		name = "Unity"
	pakpath = os.path.abspath(os.path.join("tmp", version, root, name+".mpkg", "Contents/Resources", name+".pkg", "Contents"))
	outpath = os.path.abspath(version)
	if not os.path.isdir(outpath):
		os.makedirs(outpath)
	subprocess.run([path_to_7z, "x", os.path.join(pakpath, "Archive.pax.gz"), "-aos", f"-o{pakpath}"],
		stdout=subprocess.DEVNULL,
    	stderr=subprocess.STDOUT)
	subprocess.run([path_to_7z, "x", os.path.join(pakpath, "Archive.pax"), "*Documentation*", "-r", "-aos", f"-o{outpath}"],
		stdout=subprocess.DEVNULL,
    	stderr=subprocess.STDOUT)
	try:
		for i in os.listdir(os.path.join(outpath, name)):
			if ".app" in i:
				shutil.rmtree(os.path.join(outpath, name, i))
			else:
				shutil.move(os.path.join(outpath, name, i), os.path.join(outpath, i))
		shutil.rmtree(os.path.join(outpath, name))
	except:
		print(f"Failed to cleanup {version}")

print("Done.")
