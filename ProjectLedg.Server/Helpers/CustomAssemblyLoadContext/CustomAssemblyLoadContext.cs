using System;
using System.Runtime.InteropServices;
using System.Runtime.Loader;

public class CustomAssemblyLoadContext : AssemblyLoadContext
{
    public IntPtr LoadUnmanagedLibrary(string absolutePath)
    {
        return NativeLibrary.Load(absolutePath); // Directly load the unmanaged DLL
    }

    protected override IntPtr LoadUnmanagedDll(string unmanagedDllName)
    {
        // Optionally provide custom logic if needed
        return IntPtr.Zero;
    }
}
