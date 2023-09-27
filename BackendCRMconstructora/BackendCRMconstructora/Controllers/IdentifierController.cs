using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BackendCRMconstructora.Contexts;
using BackendCRMconstructora.Models;

namespace BackendCRMconstructora.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class IdentifierController : ControllerBase
    {
        private readonly ConnectionSQLServer _context;

        public IdentifierController(ConnectionSQLServer context)
        {
            _context = context;
        }

        // GET: api/Identifier
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Identifier>>> GetIdentifier()
        {
          if (_context.Identifier == null)
          {
              return NotFound();
          }
            return await _context.Identifier.ToListAsync();
        }

        // GET: api/Identifier/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Identifier>> GetIdentifier(int id)
        {
          if (_context.Identifier == null)
          {
              return NotFound();
          }
            var identifier = await _context.Identifier.FindAsync(id);

            if (identifier == null)
            {
                return NotFound();
            }

            return identifier;
        }

        // PUT: api/Identifier/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutIdentifier(int id, Identifier identifier)
        {
            if (id != identifier.IdentifierID)
            {
                return BadRequest();
            }

            _context.Entry(identifier).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!IdentifierExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/Identifier
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Identifier>> PostIdentifier(Identifier identifier)
        {
          if (_context.Identifier == null)
          {
              return Problem("Entity set 'ConnectionSQLServer.Identifier'  is null.");
          }
            _context.Identifier.Add(identifier);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetIdentifier", new { id = identifier.IdentifierID }, identifier);
        }

        // DELETE: api/Identifier/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteIdentifier(int id)
        {
            if (_context.Identifier == null)
            {
                return NotFound();
            }
            var identifier = await _context.Identifier.FindAsync(id);
            if (identifier == null)
            {
                return NotFound();
            }

            _context.Identifier.Remove(identifier);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool IdentifierExists(int id)
        {
            return (_context.Identifier?.Any(e => e.IdentifierID == id)).GetValueOrDefault();
        }
    }
}
