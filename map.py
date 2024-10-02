import os
import shutil

def move_images_to_single_folder(source_directory, target_directory, image_extensions=['.jpg', '.jpeg', '.png', '.gif']):
    # Create the target directory if it doesn't exist
    if not os.path.exists(target_directory):
        os.makedirs(target_directory)

    # Walk through the source directory
    for root, dirs, files in os.walk(source_directory):
        for file in files:
            if os.path.splitext(file)[1].lower() in image_extensions:
                source_path = os.path.join(root, file)
                target_path = os.path.join(target_directory, file)
                
                # Check if the file already exists in the target directory
                if not os.path.exists(target_path):
                    shutil.move(source_path, target_directory)
                    print(f"Moved: {source_path} -> {target_directory}")
                else:
                    print(f"Skipped (already exists): {source_path} -> {target_directory}")

# Example usage
source_directory = '/path/to/your/source_directory'
target_directory = '/path/to/your/target_directory'

move_images_to_single_folder(source_directory, target_directory)
