
import { supabase } from "../integrations/supabase/client";

export const createDefaultAdmin = async () => {
  try {
    // Check if admin user already exists
    const { data: existingUsers, error: checkError } = await supabase
      .from("profiles")
      .select("id")
      .eq("role", "admin");

    if (checkError) {
      console.error("Error checking for existing admin:", checkError);
      return;
    }

    if (existingUsers && existingUsers.length > 0) {
      console.info("Admin user already exists, skipping creation");
      return;
    }

    // Create the default admin user
    const email = "admin@mochcare.com";
    const password = "Password@55";

    // Check if the user already exists in auth
    const { data: authData, error: authError } = await supabase.auth.admin.listUsers();
    
    let userId = null;
    
    if (authError) {
      console.error("Error checking existing auth users:", authError);
    } else if (authData && authData.users && Array.isArray(authData.users)) {
      // Check if user with this email already exists
      const existingUser = authData.users.find(user => 
        user && typeof user === 'object' && 'email' in user && user.email === email
      );
      
      if (existingUser && existingUser.id) {
        userId = existingUser.id;
        console.info("Auth user already exists, using existing ID");
      }
    }
    
    // If user doesn't exist, create a new one
    if (!userId) {
      const { data: newUser, error: signupError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (signupError) {
        console.error("Error creating admin user:", signupError);
        return;
      }
      
      userId = newUser?.user?.id;
      
      if (!userId) {
        console.error("Failed to get user ID after signup");
        return;
      }
    }
    
    // Add the admin profile
    const { error: profileError } = await supabase.from("profiles").insert({
      id: userId,
      full_name: "System Administrator",
      role: "admin",
      is_active: true,
    });

    if (profileError) {
      console.error("Error creating admin profile:", profileError);
      return;
    }

    console.info("Default admin user created successfully");
  } catch (error) {
    console.error("Unexpected error creating admin user:", error);
  }
};
